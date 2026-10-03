import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppErrorBoundary from './components/AppErrorBoundary';
import { StoreProvider } from './context/StoreContext';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
