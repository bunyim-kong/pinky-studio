import { Boxes, FolderTree, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/format';

export default function AdminStats() {
  const { products, categories } = useStore();
  const catalogValue = products.reduce(
    (total, product) => total + (product.salePrice ?? product.price),
    0,
  );

  return (
    <section className="admin-stats" aria-label="Catalog summary">
      <article><span><Boxes /></span><div><small>Total products</small><strong>{products.length}</strong></div></article>
      <article><span><FolderTree /></span><div><small>Categories</small><strong>{categories.length}</strong></div></article>
      <article><span><Store /></span><div><small>Catalog value</small><strong>{formatCurrency(catalogValue)}</strong></div></article>
    </section>
  );
}
