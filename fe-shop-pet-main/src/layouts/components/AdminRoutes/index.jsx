import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoutes = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const { role } = jwtDecode(token);
        if (role !== 'ADMIN') {
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoutes;
