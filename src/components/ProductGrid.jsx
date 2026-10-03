import ProductCard from './ProductCard';

export default function ProductGrid({ products: productList }) {
  if (productList.length === 0) {
    return (
      <div className="empty-state">
        <h2>No products found</h2>
        <p>Try another search or clear a filter.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {productList.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
