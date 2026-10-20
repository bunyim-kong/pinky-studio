import { ArrowLeft, Boxes, FolderTree } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Toast from '../components/Toast';
import '../pages/admin/Admin.css';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/">
          <span>PS</span>
          <strong>Pinky Studio<small>Store admin</small></strong>
        </Link>
        <nav aria-label="Admin navigation">
          <NavLink to="products"><Boxes /> Products</NavLink>
          <NavLink to="categories"><FolderTree /> Categories</NavLink>
        </nav>
        <Link className="admin-store-link" to="/"><ArrowLeft /> Back to storefront</Link>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}
