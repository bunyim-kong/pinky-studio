import { LockKeyhole } from 'lucide-react';
import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';
import './CheckoutPage.css';

const initialForm = {
  name: '',
  phone: '',
  address: '',
  city: '',
  country: 'Cambodia',
  payment: 'card',
};

export default function CheckoutPage() {
  const { user, cartLines, cartSubtotal, shipping, cartTotal, placeOrder } = useStore();
  const [form, setForm] = useState(initialForm);
  const orderPlaced = useRef(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (cartLines.length === 0 && !orderPlaced.current) return <Navigate to="/cart" replace />;

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    orderPlaced.current = true;
    placeOrder(form);
    navigate('/account?order=success');
  }

  return (
    <div className="checkout-page">
      <ScrollToTop />
      <div className="container checkout-page__header">
        <span className="wordmark">Pinky <span>Studio</span></span>
        <span><LockKeyhole size={16} /> Secure checkout</span>
      </div>
      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-step"><span>1</span><div><p className="eyebrow">Delivery</p><h1>Where should we send your order?</h1></div></div>
          <div className="form-grid">
            <label className="form-grid__full">Recipient name<input name="name" value={form.name} onChange={handleChange} autoComplete="name" required /></label>
            <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" required /></label>
            <label>Country or region<select name="country" value={form.country} onChange={handleChange}><option>Cambodia</option><option>Singapore</option><option>Thailand</option><option>Vietnam</option></select></label>
            <label className="form-grid__full">Delivery address<input name="address" value={form.address} onChange={handleChange} autoComplete="street-address" required /></label>
            <label className="form-grid__full">City<input name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" required /></label>
          </div>

          <div className="checkout-step checkout-step--payment"><span>2</span><div><p className="eyebrow">Payment</p><h2>Choose a demo payment method</h2></div></div>
          <div className="payment-options">
            <label><input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} /><span><strong>Card payment</strong><small>Demo only — no card details are collected.</small></span></label>
            <label><input type="radio" name="payment" value="qr" checked={form.payment === 'qr'} onChange={handleChange} /><span><strong>QR payment</strong><small>Mock local payment option.</small></span></label>
          </div>
          <button className="button button--primary button--wide" type="submit">Place demo order · {formatCurrency(cartTotal)}</button>
        </form>

        <aside className="checkout-summary">
          <h2>Your order</h2>
          {cartLines.map(({ product, quantity }) => (
            <div className="checkout-item" key={product.id}>
              <span className="checkout-item__image"><img src={product.image} alt="" width="56" height="56" /><small>{quantity}</small></span>
              <span><strong>{product.name}</strong><small>{product.size}</small></span>
              <strong>{formatCurrency((product.salePrice ?? product.price) * quantity)}</strong>
            </div>
          ))}
          <div className="checkout-summary__totals"><span>Subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong><span>Delivery</span><strong>{shipping ? formatCurrency(shipping) : 'Complimentary'}</strong></div>
          <div className="checkout-summary__total"><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
