import { LayoutDashboard, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStats from '../../components/admin/AdminStats';
import { useStore } from '../../context/StoreContext';
import { pluralize } from '../../utils/format';

export default function AdminCategoriesPage() {
  const { products, categories, createCategory, renameCategory, deleteCategory } = useStore();
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryError, setCategoryError] = useState('');

  function addCategory(event) {
    event.preventDefault();
    const result = createCategory(categoryName);
    if (!result.ok) {
      setCategoryError(result.message);
      return;
    }
    setCategoryName('');
    setCategoryError('');
  }

  function saveCategory(event) {
    event.preventDefault();
    const result = renameCategory(editingCategory.original, editingCategory.name);
    if (!result.ok) {
      setCategoryError(result.message);
      return;
    }
    setEditingCategory(null);
    setCategoryError('');
  }

  function removeCategory(category) {
    if (!window.confirm(`Remove the ${category} category?`)) return;
    const result = deleteCategory(category);
    setCategoryError(result.ok ? '' : result.message);
  }

  return (
    <>
      <AdminPageHeader title="Categories" />
      <AdminStats />

      <section className="admin-panel admin-category-panel">
        <div className="admin-panel__toolbar"><div><h2>Product categories</h2><p>Organize the filters customers see in the shop.</p></div></div>
        <form className="admin-category-add" onSubmit={addCategory}>
          <label><span>New category name</span><input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="e.g. Masks" required /></label>
          <button className="admin-button admin-button--primary" type="submit"><Plus /> Add category</button>
        </form>
        {categoryError && <p className="admin-form-error" role="alert">{categoryError}</p>}
        <div className="admin-category-list">
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category).length;
            return editingCategory?.original === category ? (
              <form className="admin-category-row admin-category-row--editing" key={category} onSubmit={saveCategory}>
                <input value={editingCategory.name} onChange={(event) => setEditingCategory({ ...editingCategory, name: event.target.value })} autoFocus required />
                <button className="admin-button admin-button--primary" type="submit">Save</button>
                <button className="admin-button admin-button--secondary" type="button" onClick={() => setEditingCategory(null)}>Cancel</button>
              </form>
            ) : (
              <article className="admin-category-row" key={category}>
                <span className="admin-category-icon"><LayoutDashboard /></span>
                <div><strong>{category}</strong><small>{count} {pluralize(count, 'product')}</small></div>
                <div className="admin-row-actions"><button type="button" onClick={() => setEditingCategory({ original: category, name: category })} aria-label={`Rename ${category}`}><Pencil /></button><button className="danger" type="button" onClick={() => removeCategory(category)} aria-label={`Delete ${category}`}><Trash2 /></button></div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
