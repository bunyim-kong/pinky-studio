import { ArrowRight, Droplets, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { featuredProducts, newArrivals } from '../data/products';

const categoryCards = [
  { name: 'Cleanse', category: 'Cleansers', image: featuredProducts[0].image },
  { name: 'Treat', category: 'Serums', image: featuredProducts[2].image },
  { name: 'Moisturize', category: 'Moisturizers', image: featuredProducts[3].image },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Curated skincare from Asia</p>
            <h1>A calmer routine starts here.</h1>
            <p className="hero__lead">
              Effective, gentle formulas selected to make daily skincare feel clear and considered.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/shop">Shop all skincare</Link>
              <Link className="text-link" to="/about">Meet Pinky Studio <ArrowRight size={17} /></Link>
            </div>
            <div className="hero__notes">
              <span><ShieldCheck size={17} /> Carefully selected</span>
              <span><Leaf size={17} /> Routine friendly</span>
            </div>
          </div>
          <div className="hero__visual">
            <img
              src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1500&q=90"
              alt="A considered collection of skincare bottles"
              width="1500"
              height="1200"
            />
            <div className="hero__caption">
              <span>Routine 01</span>
              <strong>Hydration, without the guesswork.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store benefits">
        <div className="container trust-strip__grid">
          <span><Sparkles /> Curated formulas</span>
          <span><Droplets /> Skin-first guidance</span>
          <span><ShieldCheck /> Secure checkout</span>
          <span><Leaf /> Thoughtful routines</span>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Find your step</p>
            <h2>Build a routine that feels simple</h2>
          </div>
          <Link className="text-link desktop-only" to="/shop">Shop every category <ArrowRight size={17} /></Link>
        </div>
        <div className="category-grid">
          {categoryCards.map((card, index) => (
            <Link
              className={`category-card category-card--${index + 1}`}
              key={card.name}
              to={`/shop?category=${card.category}`}
            >
              <img src={card.image} alt="" width="800" height="1000" />
              <span className="category-card__overlay">
                <span>Step 0{index + 1}</span>
                <strong>{card.name}</strong>
                <small>Explore {card.category.toLowerCase()}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2>Community favorites</h2>
            </div>
            <Link className="text-link" to="/shop">View all <ArrowRight size={17} /></Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="editorial container">
        <div className="editorial__image">
          <img
            src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1300&q=88"
            alt="Serum bottles arranged in soft natural light"
            loading="lazy"
            width="1300"
            height="1500"
          />
        </div>
        <div className="editorial__copy">
          <p className="eyebrow">The Pinky edit</p>
          <h2>Less noise. Better daily care.</h2>
          <p>
            We look for formulas that have a clear place in a routine: gentle cleansers,
            comfortable hydration and targeted treatments you can use consistently.
          </p>
          <Link className="button button--outline" to="/about">How we curate</Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Just in</p>
            <h2>New to the shelf</h2>
          </div>
          <Link className="text-link" to="/shop?sort=newest">Shop new arrivals <ArrowRight size={17} /></Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>
    </>
  );
}
