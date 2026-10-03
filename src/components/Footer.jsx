import { Instagram, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    setEmail('');
    setSubscribed(true);
  }

  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link className="wordmark wordmark--light" to="/">Pinky <span>Studio</span></Link>
          <p>Thoughtful skincare selected for simple, consistent routines.</p>
        </div>
        <div>
          <h2>Shop</h2>
          <Link to="/shop">All products</Link>
          <Link to="/shop?sort=newest">New arrivals</Link>
          <Link to="/brands">Brands</Link>
        </div>
        <div>
          <h2>Help</h2>
          <Link to="/about">Our story</Link>
          <Link to="/support">Shipping and returns</Link>
          <Link to="/support">Contact</Link>
        </div>
        <div>
          <h2>Stay close</h2>
          <p>Routine notes, new formulas and useful skincare guidance.</p>
          <form className="newsletter" onSubmit={handleNewsletterSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="Email address" required />
            <button type="submit" aria-label="Join newsletter"><Mail /></button>
          </form>
          <span className="newsletter-status" role="status" aria-live="polite">{subscribed ? 'You’re on the list.' : ''}</span>
          <a className="social-link" href="https://www.instagram.com" target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Pinky Studio</span>
        <span><Link to="/support">Privacy</Link> · <Link to="/support">Terms</Link></span>
      </div>
    </footer>
  );
}
