import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import thư viện vừa cài

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);

                const username = decodedToken.sub;

                setUser({ username: username });
            } catch (error) {
                console.error('Lỗi giải mã token:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setLoading(false);
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        try {
            const decodedToken = jwtDecode(accessToken);
            const username = decodedToken.sub;
            setUser({ username: username });
        } catch (error) {
            console.error('Lỗi giải mã token khi đăng nhập:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout, loading}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
