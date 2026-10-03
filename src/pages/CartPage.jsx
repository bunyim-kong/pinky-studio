import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const { user, cartLines, cartSubtotal, shipping, cartTotal, updateQuantity, removeFromCart } = useStore();

  if (!user) {
    return (
      <div className="container empty-state empty-state--page">
        <ShoppingBag size={34} />
        <p className="eyebrow">Your bag is waiting</p>
        <h1>Sign in to view your bag</h1>
        <p>Sign in to open the shopping bag saved for this account in this browser.</p>
        <Link className="button button--primary" to="/login">Sign in or register</Link>
        <Link className="text-link" to="/shop">Continue shopping</Link>
      </div>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div className="container empty-state empty-state--page">
        <ShoppingBag size={34} />
        <p className="eyebrow">Your bag</p>
        <h1>It’s quiet in here</h1>
        <p>Explore our edit and choose the next step in your routine.</p>
        <Link className="button button--primary" to="/shop">Shop skincare</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <header className="page-heading page-heading--left">
        <p className="eyebrow">Your selection</p>
        <h1>Shopping bag</h1>
      </header>
      <div className="cart-layout">
        <div className="cart-list">
          {cartLines.map(({ product, quantity }) => (
            <article className="cart-line" key={product.id}>
              <Link to={`/products/${product.id}`}><img src={product.image} alt={product.name} width="300" height="300" /></Link>
              <div className="cart-line__details">
                <p className="eyebrow">{product.brand}</p>
                <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
                <p>{product.size}</p>
                <div className="quantity-control quantity-control--small">
                  <button type="button" onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus /></button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity"><Plus /></button>
                </div>
              </div>
              <div className="cart-line__end">
                <strong>{formatCurrency((product.salePrice ?? product.price) * quantity)}</strong>
                <button type="button" onClick={() => removeFromCart(product.id)}><Trash2 size={16} /> Remove</button>
              </div>
            </article>
          ))}
        </div>
        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong></div>
          <div><span>Delivery</span><strong>{shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</strong></div>
          <p>{cartSubtotal < 80 ? `Add ${formatCurrency(80 - cartSubtotal)} for complimentary delivery.` : 'You have complimentary delivery.'}</p>
          <div className="order-summary__total"><span>Estimated total</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <Link className="button button--primary button--wide" to="/checkout">Secure checkout</Link>
          <Link className="text-link text-link--center" to="/shop">Continue shopping</Link>
          <small>Taxes, if applicable, are confirmed at checkout.</small>
        </aside>
      </div>
    </div>
  );
}
