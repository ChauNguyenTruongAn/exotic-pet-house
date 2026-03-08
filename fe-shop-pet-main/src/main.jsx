import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import '@/styles/index.scss';
import AppRoutes from './routes/routes';
import { AuthProvider } from './context';
import { CartProvider } from './context/cart';
import { SearchProvider } from './context/search';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <SearchProvider>
                <CartProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </CartProvider>
            </SearchProvider>
        </AuthProvider>
    </StrictMode>,
);
