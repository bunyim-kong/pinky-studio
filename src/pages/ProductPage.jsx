import { Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { formatCurrency } from '../utils/format';
import './ProductPage.css';

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const product = products.find((item) => item.id === productId);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [productId]);

  if (!product) {
    return (
      <div className="container empty-state empty-state--page">
        <h1>Product not found</h1>
        <Link className="button button--primary" to="/shop">Return to shop</Link>
      </div>
    );
  }

  const recommendations = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  const currentPrice = product.salePrice ?? product.price;

  function handleAddToCart() {
    const added = addToCart(product.id, quantity);
    if (!added) navigate('/login');
  }

  return (
    <>
      <div className="container breadcrumbs"><Link to="/shop">Shop</Link><span>/</span><Link to={`/shop?category=${product.category}`}>{product.category}</Link></div>
      <section className="container product-detail">
        <div className="product-gallery">
          <div className="product-gallery__thumbs">
            {product.gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
                aria-label={`Show product image ${index + 1}`}
              >
                <img src={image} alt="" width="160" height="160" />
              </button>
            ))}
          </div>
          <div className="product-gallery__main">
            {product.badge && <span className="product-card__badge">{product.badge}</span>}
            <img src={product.gallery[selectedImage]} alt={`${product.name} by ${product.brand}`} width="900" height="1100" />
          </div>
        </div>

        <div className="product-summary">
          <p className="eyebrow">{product.brand} · {product.origin}</p>
          <h1>{product.name}</h1>
          <div className="product-summary__rating">
            <span><Star size={16} fill="currentColor" /> {product.rating}</span>
            <span>{product.reviews} reviews</span>
          </div>
          <div className="product-summary__price">
            {product.salePrice && <del>{formatCurrency(product.price)}</del>}
            <strong>{formatCurrency(currentPrice)}</strong>
            <span>{product.size}</span>
          </div>
          <p className="product-summary__description">{product.description}</p>

          <div className="skin-tags">
            {product.skinTypes.map((skinType) => <span key={skinType}>{skinType}</span>)}
          </div>

          <div className="purchase-row">
            <div className="quantity-control" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus /></button>
            </div>
            <button className="button button--primary button--wide" type="button" onClick={handleAddToCart}>
              {user ? `Add to bag · ${formatCurrency(currentPrice * quantity)}` : 'Log in to add to bag'}
            </button>
          </div>

          <div className="product-benefits">
            <p><Truck /> Free delivery over $80</p>
            <p><ShieldCheck /> Secure checkout</p>
          </div>

          <details open>
            <summary>Why you’ll like it</summary>
            <p>{product.description}</p>
          </details>
          <details>
            <summary>Ingredients</summary>
            <p>{product.ingredients}</p>
          </details>
          <details>
            <summary>How to use</summary>
            <p>{product.directions}</p>
          </details>
        </div>
      </section>

      {recommendations.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-heading"><p className="eyebrow">Complete the routine</p><h2>You may also like</h2></div>
            <ProductGrid products={recommendations} />
          </div>
        </section>
      )}
    </>
  );
}
