import { LogOut, PackageCheck, UserRound } from 'lucide-react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { formatCurrency, pluralize } from '../utils/format';

export default function AccountPage() {
  const { user, orders, logout } = useStore();
  const [searchParams] = useSearchParams();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container account-page">
      {searchParams.get('order') === 'success' && (
        <div className="success-banner"><PackageCheck /><div><strong>Your order is confirmed</strong><span>A demo confirmation has been added to your order history.</span></div></div>
      )}
      <header className="account-header">
        <div><p className="eyebrow">Your account</p><h1>Hello, {user.name}</h1><p>{user.email}</p></div>
        <button className="button button--outline" type="button" onClick={logout}><LogOut size={17} /> Sign out</button>
      </header>
      <div className="account-grid">
        <aside className="account-nav"><strong><UserRound /> Account overview</strong></aside>
        <section className="orders-panel">
          <div className="section-heading section-heading--split"><div><p className="eyebrow">Order history</p><h2>Your orders</h2></div></div>
          {orders.length === 0 ? (
            <div className="empty-state"><p>You haven’t placed an order yet.</p><Link className="button button--primary" to="/shop">Start shopping</Link></div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card__header"><span><small>Order</small><strong>{order.id}</strong></span><span><small>Date</small><strong>{order.date}</strong></span><span><small>Total</small><strong>{formatCurrency(order.total)}</strong></span><em>{order.status}</em></div>
                  <div className="order-card__products">
                    {order.items.map((item) => {
                      const product = products.find((candidate) => candidate.id === item.productId);
                      return product ? <img key={item.productId} src={product.image} alt={product.name} width="56" height="56" /> : <span key={item.productId}>{item.quantity} {pluralize(item.quantity, 'item')}</span>;
                    })}
                    <p>Your order is being prepared. Tracking will appear here after dispatch.</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
