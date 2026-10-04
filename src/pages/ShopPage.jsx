import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { categories, products } from '../data/products';
import { pluralize } from '../utils/format';
import './ShopPage.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedCategory = searchParams.get('category') ?? 'All';
  const urlSearch = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(urlSearch);
  const sort = searchParams.get('sort') ?? 'featured';
  const searchParamsString = searchParams.toString();

  useEffect(() => setSearchInput(urlSearch), [urlSearch]);

  useEffect(() => {
    if (searchInput === urlSearch) return undefined;
    const timerId = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParamsString);
      if (searchInput.trim()) nextParams.set('q', searchInput.trim());
      else nextParams.delete('q');
      setSearchParams(nextParams, { replace: true });
    }, 250);
    return () => window.clearTimeout(timerId);
  }, [searchInput, searchParamsString, setSearchParams, urlSearch]);

  function updateParam(name, value, defaultValue = '') {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) nextParams.delete(name);
    else nextParams.set(name, value);
    setSearchParams(nextParams);
  }

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchInput.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const searchText = `${product.name} ${product.brand} ${product.category} ${product.concerns.join(' ')}`.toLowerCase();
      return matchesCategory && searchText.includes(normalizedSearch);
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-low') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      if (sort === 'price-high') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      if (sort === 'newest') return new Date(b.addedAt) - new Date(a.addedAt);
      return b.rating - a.rating;
    });
  }, [searchInput, selectedCategory, sort]);

  function clearFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  return (
    <div className="shop-page container">
      <header className="page-heading">
        <p className="eyebrow">The full edit</p>
        <h1>Skincare</h1>
        <p>Shop gentle everyday formulas by routine step, concern or brand.</p>
      </header>

      <div className="shop-toolbar">
        <button className="filter-toggle" type="button" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={18} /> Filters
        </button>
        <label className="shop-search">
          <Search size={18} />
          <span className="sr-only">Search products</span>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search skincare"
          />
        </label>
        <span className="shop-count">{visibleProducts.length} {pluralize(visibleProducts.length, 'product')}</span>
        <label className="shop-sort">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => updateParam('sort', event.target.value, 'featured')}>
            <option value="featured">Top rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="shop-layout">
        <aside className={`filters ${filtersOpen ? 'filters--open' : ''}`}>
          <div className="filters__mobile-header">
            <strong>Filters</strong>
            <button type="button" className="icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button>
          </div>
          <div className="filter-group">
            <h2>Category</h2>
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category}
                  onChange={() => updateParam('category', category, 'All')}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
          {(selectedCategory !== 'All' || searchInput || sort !== 'featured') && (
            <button className="clear-button" type="button" onClick={clearFilters}>Clear all filters</button>
          )}
          <button className="button button--primary filters__apply" type="button" onClick={() => setFiltersOpen(false)}>
            Show {visibleProducts.length} {pluralize(visibleProducts.length, 'product')}
          </button>
        </aside>
        {filtersOpen && <button className="drawer-backdrop" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
        <ProductGrid products={visibleProducts} />
      </div>
    </div>
  );
}
