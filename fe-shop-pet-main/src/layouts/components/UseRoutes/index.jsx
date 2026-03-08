import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserRoutes = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const { role } = jwtDecode(token);

        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }

        return children;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }

};

export default UserRoutes;
