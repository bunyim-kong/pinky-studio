import { X } from 'lucide-react';
import { useState } from 'react';

const blankProduct = {
  name: '',
  brand: '',
  category: '',
  price: '',
  salePrice: '',
  size: '',
  origin: '',
  badge: '',
  image: '',
  gallery: '',
  rating: '5',
  reviews: '0',
  skinTypes: 'All skin types',
  concerns: '',
  description: '',
  ingredients: '',
  directions: '',
};

function valueToList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function ProductEditor({ categories, product, onClose, onSave }) {
  const [form, setForm] = useState(() => product ? {
    ...product,
    salePrice: product.salePrice ?? '',
    gallery: product.gallery.join('\n'),
    skinTypes: product.skinTypes.join(', '),
    concerns: product.concerns.join(', '),
  } : { ...blankProduct, category: categories[0] ?? '' });
  const [error, setError] = useState('');

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const gallery = form.gallery.split('\n').map((item) => item.trim()).filter(Boolean);
    const image = form.image.trim();
    if (!categories.length) {
      setError('Create a category before adding a product.');
      return;
    }
    if (!image) {
      setError('Add a main image URL.');
      return;
    }

    const nextProduct = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      size: form.size.trim(),
      origin: form.origin.trim(),
      badge: form.badge.trim(),
      image,
      gallery: [image, ...gallery.filter((item) => item !== image)],
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      skinTypes: valueToList(form.skinTypes),
      concerns: valueToList(form.concerns),
      description: form.description.trim(),
      ingredients: form.ingredients.trim(),
      directions: form.directions.trim(),
    };
    if (form.salePrice !== '') nextProduct.salePrice = Number(form.salePrice);
    onSave(nextProduct);
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-editor-title">
      <button className="admin-modal__backdrop" type="button" aria-label="Close editor" onClick={onClose} />
      <section className="admin-modal__panel">
        <header className="admin-modal__header">
          <div><span>{product ? 'Edit product' : 'New product'}</span><h2 id="product-editor-title">{product?.name ?? 'Add to the catalog'}</h2></div>
          <button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close editor"><X /></button>
        </header>
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-section">
            <h3>Product details</h3>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--wide">Product name<input name="name" value={form.name} onChange={handleChange} required /></label>
              <label className="admin-field">Brand<input name="brand" value={form.brand} onChange={handleChange} required /></label>
              <label className="admin-field">Category<select name="category" value={form.category} onChange={handleChange} required><option value="" disabled>Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="admin-field">Regular price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required /></label>
              <label className="admin-field">Sale price <span>(optional)</span><input name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} /></label>
              <label className="admin-field">Size<input name="size" value={form.size} onChange={handleChange} placeholder="50 ml" required /></label>
              <label className="admin-field">Origin<input name="origin" value={form.origin} onChange={handleChange} placeholder="South Korea" required /></label>
              <label className="admin-field admin-field--wide">Badge <span>(optional)</span><input name="badge" value={form.badge} onChange={handleChange} placeholder="New, Bestseller..." /></label>
            </div>
          </div>

          <div className="admin-form-section">
            <h3>Images</h3>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--wide">Main image URL<input name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." required /></label>
              <label className="admin-field admin-field--wide">Extra image URLs <span>(one per line)</span><textarea name="gallery" rows="3" value={form.gallery} onChange={handleChange} placeholder="https://..." /></label>
            </div>
            {form.image && <img className="admin-image-preview" src={form.image} alt="Product preview" />}
          </div>

          <div className="admin-form-section">
            <h3>Storefront information</h3>
            <div className="admin-form-grid">
              <label className="admin-field">Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} required /></label>
              <label className="admin-field">Review count<input name="reviews" type="number" min="0" step="1" value={form.reviews} onChange={handleChange} required /></label>
              <label className="admin-field admin-field--wide">Skin types <span>(comma separated)</span><input name="skinTypes" value={form.skinTypes} onChange={handleChange} required /></label>
              <label className="admin-field admin-field--wide">Concerns <span>(comma separated)</span><input name="concerns" value={form.concerns} onChange={handleChange} required /></label>
              <label className="admin-field admin-field--wide">Description<textarea name="description" rows="3" value={form.description} onChange={handleChange} required /></label>
              <label className="admin-field admin-field--wide">Ingredients<textarea name="ingredients" rows="3" value={form.ingredients} onChange={handleChange} required /></label>
              <label className="admin-field admin-field--wide">How to use<textarea name="directions" rows="3" value={form.directions} onChange={handleChange} required /></label>
            </div>
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <footer className="admin-modal__actions">
            <button className="admin-button admin-button--secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit">{product ? 'Save changes' : 'Create product'}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
