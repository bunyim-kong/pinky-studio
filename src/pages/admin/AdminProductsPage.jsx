import { PackagePlus, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStats from '../../components/admin/AdminStats';
import ProductEditor from '../../components/admin/ProductEditor';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, pluralize } from '../../utils/format';

export default function AdminProductsPage() {
  const { products, categories, createProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(undefined);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) =>
      `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query),
    );
  }, [products, search]);

  function saveProduct(nextProduct) {
    if (editingProduct) updateProduct(editingProduct.id, nextProduct);
    else createProduct(nextProduct);
    setEditingProduct(undefined);
  }

  function removeProduct(product) {
    if (window.confirm(`Remove ${product.name} from the store?`)) deleteProduct(product.id);
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        action={<button className="admin-button admin-button--primary" type="button" onClick={() => setEditingProduct(null)}><Plus /> Add product</button>}
      />
      <AdminStats />

      <section className="admin-panel">
        <div className="admin-panel__toolbar">
          <div><h2>All products</h2><p>{products.length} {pluralize(products.length, 'item')} published to the storefront</p></div>
          <label className="admin-search"><Search /><span className="sr-only">Search products</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search catalog" /></label>
        </div>
        {visibleProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td><div className="admin-product-cell"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.brand} · {product.size}</small></span></div></td>
                    <td><span className="admin-pill">{product.category}</span></td>
                    <td>{product.salePrice ? <span className="admin-price"><strong>{formatCurrency(product.salePrice)}</strong><del>{formatCurrency(product.price)}</del></span> : <strong>{formatCurrency(product.price)}</strong>}</td>
                    <td>{product.rating.toFixed(1)} <small>({product.reviews})</small></td>
                    <td><div className="admin-row-actions"><button type="button" onClick={() => setEditingProduct(product)} aria-label={`Edit ${product.name}`}><Pencil /></button><button className="danger" type="button" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}><Trash2 /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty"><PackagePlus /><h2>No products found</h2><p>Try another search or add a new product.</p></div>
        )}
      </section>

      {editingProduct !== undefined && (
        <ProductEditor
          categories={categories}
          product={editingProduct}
          onClose={() => setEditingProduct(undefined)}
          onSave={saveProduct}
        />
      )}
    </>
  );
}
