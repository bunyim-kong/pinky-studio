import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { pluralize } from '../utils/format';

export function BrandsPage() {
  const brands = [...new Set(products.map((product) => product.brand))];
  return (
    <div className="container info-page">
      <header className="page-heading"><p className="eyebrow">The makers we trust</p><h1>Brands</h1><p>Explore thoughtful skincare from South Korea, Japan and Hong Kong.</p></header>
      <div className="brand-list">
        {brands.map((brand, index) => (
          <Link to={`/shop?q=${encodeURIComponent(brand)}`} key={brand}><span>0{index + 1}</span><strong>{brand}</strong><small>{products.filter((product) => product.brand === brand).length} {pluralize(products.filter((product) => product.brand === brand).length, 'product')}</small><ArrowRight /></Link>
        ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="container about-hero"><div><p className="eyebrow">About Pinky Studio</p><h1>Skincare should feel easier to understand.</h1></div><p>We curate a focused collection of formulas with a clear role in real routines. Each product is selected for comfort, clarity and consistent use.</p></section>
      <section className="container editorial editorial--reverse"><div className="editorial__image"><img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1300&q=88" alt="A skincare ritual in soft natural light" width="1300" height="1500" /></div><div className="editorial__copy"><p className="eyebrow">Our approach</p><h2>A considered shelf, not an endless one.</h2><p>We organize products by routine step, skin type and concern so you can compare what matters. Clear descriptions and practical directions come before trends.</p><Link className="button button--primary" to="/shop">Explore the collection</Link></div></section>
    </div>
  );
}

export function SupportPage() {
  return (
    <div className="container info-page"><header className="page-heading"><p className="eyebrow">Here to help</p><h1>Support</h1><p>Useful information for delivery, returns and your account.</p></header><div className="support-grid"><article><span>01</span><h2>Delivery</h2><p>Demo orders over $80 receive complimentary delivery. Available regions and fees are confirmed at checkout.</p></article><article><span>02</span><h2>Returns</h2><p>This learning project uses placeholder policy content. A real store owner must approve the final return terms.</p></article><article><span>03</span><h2>Contact</h2><p>Email hello@pinkystudio.example and include your order reference so the team can help quickly.</p></article></div></div>
  );
}

export function NotFoundPage() {
  return <div className="container empty-state empty-state--page"><p className="eyebrow">404</p><h1>This page is out of routine</h1><Link className="button button--primary" to="/">Return home</Link></div>;
}
