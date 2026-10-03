import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function LoginPage() {
  const { user, login, pendingItem } = useStore();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [redirectTarget, setRedirectTarget] = useState(null);

  if (user) return <Navigate to={redirectTarget ?? (pendingItem ? '/cart' : '/account')} replace />;

  function handleChange(event) {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setRedirectTarget(pendingItem ? '/cart' : '/account');
    login({ email: form.email, name: form.name || form.email.split('@')[0] });
  }

  return (
    <section className="auth-page">
      <div className="auth-page__visual">
        <img
          src="https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?auto=format&fit=crop&w=1400&q=88"
          alt="Skincare bottles on a calm neutral surface"
          width="1400"
          height="1750"
        />
        <div><span>Member care</span><strong>Save your bag and return to it in this browser.</strong></div>
      </div>
      <div className="auth-card">
        <Link className="wordmark" to="/">Pinky <span>Studio</span></Link>
        <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
        <h1>{pendingItem ? 'Sign in to add your item' : mode === 'login' ? 'Sign in to your account' : 'Join Pinky Studio'}</h1>
        <p className="auth-card__intro">
          {mode === 'login'
            ? 'Use any valid email and password for this learning demo.'
            : 'Create a demo account to save your bag and view orders.'}
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>Full name<input name="name" value={form.name} onChange={handleChange} autoComplete="name" required /></label>
          )}
          <label>Email address<input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength="6" required /></label>
          <button className="button button--primary button--wide" type="submit">
            {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-points">
          <span><Check /> Bag saved in this browser</span>
          <span><Check /> Faster checkout</span>
          <span><Check /> Order history</span>
        </div>

        <p className="auth-switch">
          {mode === 'login' ? 'New to Pinky Studio?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => setMode((current) => current === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </section>
  );
}
