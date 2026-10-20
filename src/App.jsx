import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AccountPage from './pages/customer/AccountPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import HomePage from './pages/customer/HomePage';
import { AboutPage, BrandsPage, NotFoundPage, SupportPage } from './pages/customer/InfoPages';
import LoginPage from './pages/customer/LoginPage';
import ProductPage from './pages/customer/ProductPage';
import ShopPage from './pages/customer/ShopPage';

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="products/:productId" element={<ProductPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="*" element={<Navigate to="products" replace />} />
      </Route>
    </Routes>
  );
}
