import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import { AboutPage, BrandsPage, NotFoundPage, SupportPage } from './pages/InfoPages';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import ShopPage from './pages/ShopPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
    </Routes>
  );
}
