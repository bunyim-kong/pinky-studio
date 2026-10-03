import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { pluralize } from '../utils/format';

const navItems = [
  { label: 'Shop', to: '/shop' },
  { label: 'New', to: '/shop?sort=newest' },
  { label: 'Brands', to: '/brands' },
  { label: 'Our story', to: '/about' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { cartCount, user } = useStore();
  const headerRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchOverlayRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const updateMenuTop = () => setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    updateMenuTop();
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', updateMenuTop);
    window.addEventListener('scroll', updateMenuTop, { passive: true });
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', updateMenuTop);
      window.removeEventListener('scroll', updateMenuTop);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const handleDialogKeys = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [...searchOverlayRef.current.querySelectorAll('button, input')]
        .filter((element) => !element.disabled);
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    searchInputRef.current?.focus();
    document.addEventListener('keydown', handleDialogKeys);
    return () => {
      document.removeEventListener('keydown', handleDialogKeys);
      searchButtonRef.current?.focus();
    };
  }, [searchOpen]);

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    setSearchOpen(false);
    setMenuOpen(false);
  }

  function isNavActive(item) {
    const params = new URLSearchParams(location.search);
    if (item.label === 'New') {
      return location.pathname === '/shop' && params.get('sort') === 'newest';
    }
    if (item.label === 'Shop') {
      return location.pathname === '/shop' && params.get('sort') !== 'newest';
    }
    return location.pathname === item.to;
  }

  return (
    <>
      <div className="announcement">Complimentary delivery on orders over $80</div>
      <header className="site-header" ref={headerRef}>
        <div className="container header__inner">
          <button
            className="icon-button mobile-only"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <Link className="wordmark" to="/" aria-label="Pinky Studio home">
            Pinky <span>Studio</span>
          </Link>

          <nav
            id="main-navigation"
            className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`}
            aria-label="Main navigation"
            style={{ '--mobile-menu-top': `${menuTop}px` }}
          >
            <form className="mobile-nav-search" onSubmit={submitSearch}>
              <Search aria-hidden="true" />
              <label className="sr-only" htmlFor="mobile-site-search">Search products</label>
              <input
                id="mobile-site-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search skincare"
              />
              <button type="submit">Search</button>
            </form>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={() => (isNavActive(item) ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button ref={searchButtonRef} className="icon-button desktop-only" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search />
            </button>
            <Link className="icon-button" to={user ? '/account' : '/login'} aria-label={user ? 'Your account' : 'Sign in'}>
              <UserRound />
            </Link>
            <Link className="icon-button bag-button" to="/cart" aria-label={`Shopping bag with ${cartCount} ${pluralize(cartCount, 'item')}`}>
              <ShoppingBag />
              {cartCount > 0 && <span>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div ref={searchOverlayRef} className="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
          <button className="search-overlay__close" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <X />
          </button>
          <form className="search-form" onSubmit={submitSearch}>
            <label htmlFor="site-search">What are you looking for?</label>
            <div>
              <Search aria-hidden="true" />
              <input
                id="site-search"
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search serum, cleanser, sunscreen..."
              />
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
