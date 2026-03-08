import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    return (
        <div>
            <Header />
            <main>
                <ToastContainer position="top-right" autoClose={2000} />

                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
