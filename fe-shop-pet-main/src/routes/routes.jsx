import { Route, Routes } from 'react-router-dom';

import { ROUTES, ADMIN_ROUTES } from '../configs/routes';
import { Home } from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Contact from '../pages/Contact';
import Warranty from '../pages/Warranty';
import SignUp from '../pages/SignUp';
import AdminRoutes from '../layouts/components/AdminRoutes';
import Category from '../pages/admin/Category';
import Species from '../pages/admin/Speceis';
import User from '../pages/admin/User';
import Promotion from '../pages/admin/Promotion';
import PromotionUser from '../pages/Promotion';
import Receipt from '../pages/admin/Order';
import Inventory from '../pages/admin/Inventory';
import Product from '../pages/Product';
import ProductAdmin from '../pages/admin/Product';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Payment from '../pages/Payment';
import OrderDetailPage from '../pages/OrderDetailPage';
import ForgotPassword from '../pages/ForgotPassword';
import OrderHistory from '../pages/OrderHistory';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/payment*" element={<Payment />} />
            <Route
                path="/"
                element={
                    // <UserRoutes>
                    <MainLayout />
                    // </UserRoutes>
                }
            >
                <Route index element={<Home />} />
                <Route path={ROUTES.about} element={<About />} />
                <Route path={ROUTES.promotion} element={<PromotionUser />} />
                <Route path={ROUTES.contact} element={<Contact />} />
                <Route path={ROUTES.product} element={<Product />} />
                <Route path={ROUTES.warranty} element={<Warranty />} />
                <Route path={ROUTES.not_found} element={<NotFound />} />
                <Route path={ROUTES.product_detail} element={<ProductDetail />} />
                <Route path={ROUTES.cart} element={<Cart />} />
                <Route path={ROUTES.order} element={<OrderDetailPage />} />
                <Route path={ROUTES.order_history} element={<OrderHistory />} />
                <Route path={ROUTES.profile} element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
            </Route>
            <Route
                path="/admin/*"
                element={
                    <AdminRoutes>
                        <AdminLayout />
                    </AdminRoutes>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path={ADMIN_ROUTES.category} element={<Category />} />
                <Route path={ADMIN_ROUTES.species} element={<Species />} />
                <Route path={ADMIN_ROUTES.product} element={<ProductAdmin />} />
                <Route path={ADMIN_ROUTES.user} element={<User />} />
                <Route path={ADMIN_ROUTES.promotion} element={<Promotion />} />
                <Route path={ADMIN_ROUTES.receipt} element={<Receipt />} />
                <Route path={ADMIN_ROUTES.inventory} element={<Inventory />} />
                <Route path={ADMIN_ROUTES.not_found} element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
