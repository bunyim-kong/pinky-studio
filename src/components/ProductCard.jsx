import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const currentPrice = product.salePrice ?? product.price;

  function handleAddToCart() {
    const added = addToCart(product.id);
    if (!added) navigate('/login');
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={`${product.name} by ${product.brand}`} loading="lazy" width="800" height="980" />
        </Link>
        <button className="product-card__quick-add" type="button" onClick={handleAddToCart}>
          Add to bag
        </button>
      </div>
      <div className="product-card__info">
        <span className="eyebrow">{product.brand}</span>
        <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
        <div className="product-card__meta">
          <span className="rating"><Star size={14} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></span>
          <span className="price">
            {product.salePrice && <del>{formatCurrency(product.price)}</del>}
            {formatCurrency(currentPrice)}
          </span>
        </div>
      </div>
    </article>
  );
}
