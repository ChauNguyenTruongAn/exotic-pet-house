import axios from 'axios';
import { ENDPOINTS } from './endpoint';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10 * 1000,
});

axiosClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const result = await axios.post(ENDPOINTS.login + `/refresh`, {
                    refreshToken: refreshToken,
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data.data;

                console.log(newAccessToken, newRefreshToken, result.data.data);

                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);


                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);


export default axiosClient;
