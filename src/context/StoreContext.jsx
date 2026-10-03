import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { readStorage, writeStorage } from '../services/storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
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
    [cart],
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
