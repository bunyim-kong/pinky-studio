import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { categories as seedCategories, products as seedProducts } from '../data/products';
import { readStorage, writeStorage } from '../services/storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => readStorage('pinky-products', seedProducts));
  const [categories, setCategories] = useState(() =>
    readStorage('pinky-categories', seedCategories.filter((category) => category !== 'All')),
  );
  const [user, setUser] = useState(() => readStorage('pinky-user', null));
  const [cart, setCart] = useState(() =>
    user ? readStorage(`pinky-cart:${user.email.toLowerCase()}`, []) : [],
  );
  const [allOrders, setAllOrders] = useState(() => readStorage('pinky-orders', []));
  const [pendingItem, setPendingItem] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    writeStorage('pinky-user', user);
  }, [user]);
  useEffect(() => {
    if (user) writeStorage(`pinky-cart:${user.email.toLowerCase()}`, cart);
  }, [cart, user]);
  useEffect(() => {
    writeStorage('pinky-orders', allOrders);
  }, [allOrders]);
  useEffect(() => {
    writeStorage('pinky-products', products);
  }, [products]);
  useEffect(() => {
    writeStorage('pinky-categories', categories);
  }, [categories]);
  useEffect(() => {
    function syncCatalog(event) {
      if (!event.newValue) return;
      try {
        if (event.key === 'pinky-products') {
          setProducts((currentProducts) =>
            JSON.stringify(currentProducts) === event.newValue
              ? currentProducts
              : JSON.parse(event.newValue),
          );
        }
        if (event.key === 'pinky-categories') {
          setCategories((currentCategories) =>
            JSON.stringify(currentCategories) === event.newValue
              ? currentCategories
              : JSON.parse(event.newValue),
          );
        }
      } catch {
        // Ignore malformed values written outside the app.
      }
    }
    window.addEventListener('storage', syncCatalog);
    return () => window.removeEventListener('storage', syncCatalog);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timerId = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timerId);
  }, [notice]);

  function addToCart(productId, quantity = 1) {
    if (!user) {
      setPendingItem({ productId, quantity });
      return false;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === productId);
      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentCart, { productId, quantity }];
    });
    setNotice('Added to your bag');
    return true;
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.productId !== productId));
  }

  function createProduct(product) {
    const normalizedName = product.name.trim();
    const baseId = normalizedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product';
    let id = baseId;
    let suffix = 2;
    while (products.some((item) => item.id === id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    const newProduct = {
      ...product,
      id,
      name: normalizedName,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((currentProducts) => [newProduct, ...currentProducts]);
    setNotice(`${newProduct.name} was added`);
    return newProduct;
  }

  function updateProduct(productId, updates) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, ...updates, id: productId } : product,
      ),
    );
    setNotice(`${updates.name} was updated`);
  }

  function deleteProduct(productId) {
    const product = products.find((item) => item.id === productId);
    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== productId));
    setCart((currentCart) => currentCart.filter((item) => item.productId !== productId));
    setNotice(`${product?.name ?? 'Product'} was removed`);
  }

  function createCategory(name) {
    const normalizedName = name.trim();
    if (!normalizedName) return { ok: false, message: 'Enter a category name.' };
    if (normalizedName.toLowerCase() === 'all') {
      return { ok: false, message: '“All” is reserved for the storefront filter.' };
    }
    if (categories.some((category) => category.toLowerCase() === normalizedName.toLowerCase())) {
      return { ok: false, message: 'That category already exists.' };
    }
    setCategories((currentCategories) => [...currentCategories, normalizedName]);
    setNotice(`${normalizedName} was added`);
    return { ok: true };
  }

  function renameCategory(currentName, nextName) {
    const normalizedName = nextName.trim();
    if (!normalizedName) return { ok: false, message: 'Enter a category name.' };
    if (normalizedName.toLowerCase() === 'all') {
      return { ok: false, message: '“All” is reserved for the storefront filter.' };
    }
    if (
      categories.some(
        (category) => category !== currentName && category.toLowerCase() === normalizedName.toLowerCase(),
      )
    ) {
      return { ok: false, message: 'That category already exists.' };
    }
    setCategories((currentCategories) =>
      currentCategories.map((category) => category === currentName ? normalizedName : category),
    );
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.category === currentName ? { ...product, category: normalizedName } : product,
      ),
    );
    setNotice(`${currentName} was renamed`);
    return { ok: true };
  }

  function deleteCategory(name) {
    const productCount = products.filter((product) => product.category === name).length;
    if (productCount > 0) {
      return {
        ok: false,
        message: `Move or remove the ${productCount} assigned product${productCount === 1 ? '' : 's'} first.`,
      };
    }
    setCategories((currentCategories) => currentCategories.filter((category) => category !== name));
    setNotice(`${name} was removed`);
    return { ok: true };
  }

  function login({ email, name = 'Pinky customer' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const nextUser = { email: normalizedEmail, name };
    const savedCart = readStorage(`pinky-cart:${normalizedEmail}`, []);
    setUser(nextUser);

    if (pendingItem) {
      setCart(() => {
        const existingItem = savedCart.find((item) => item.productId === pendingItem.productId);
        if (existingItem) {
          return savedCart.map((item) =>
            item.productId === pendingItem.productId
              ? { ...item, quantity: item.quantity + pendingItem.quantity }
              : item,
          );
        }
        return [...savedCart, pendingItem];
      });
      setPendingItem(null);
      setNotice('Signed in and added your item');
    } else {
      setCart(savedCart);
      setNotice('Welcome back');
    }
  }

  function logout() {
    setUser(null);
    setCart([]);
    setNotice('You are signed out');
  }

  function placeOrder(customerDetails) {
    const newOrder = {
      id: `PS-${Date.now().toString().slice(-6)}`,
      date: new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date()),
      status: 'Processing',
      userEmail: user.email,
      items: cartLines.map(({ productId, quantity }) => ({ productId, quantity })),
      total: cartTotal,
      customerDetails,
    };
    setAllOrders((currentOrders) => [newOrder, ...currentOrders]);
    setCart([]);
    setNotice('Order placed successfully');
    return newOrder;
  }

  const cartLines = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          return product ? { ...item, product } : null;
        })
        .filter(Boolean),
    [cart, products],
  );

  const cartCount = cartLines.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartLines.reduce(
    (total, item) => total + (item.product.salePrice ?? item.product.price) * item.quantity,
    0,
  );
  const shipping = cartSubtotal >= 80 || cartSubtotal === 0 ? 0 : 6;
  const cartTotal = cartSubtotal + shipping;
  const orders = useMemo(
    () => allOrders.filter((order) => order.userEmail === user?.email),
    [allOrders, user],
  );

  const value = {
    products,
    categories,
    user,
    cart,
    orders,
    pendingItem,
    notice,
    cartLines,
    cartCount,
    cartSubtotal,
    shipping,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    renameCategory,
    deleteCategory,
    login,
    logout,
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return context;
}
