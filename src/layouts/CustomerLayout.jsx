import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';
import Toast from '../components/Toast';

export default function CustomerLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
