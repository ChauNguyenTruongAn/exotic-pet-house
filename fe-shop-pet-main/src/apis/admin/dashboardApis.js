import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';
const BASE_URL = '/admin/dashboard';
const dashboardApis = {
    getKpis(params) {
        return axiosClient.get(`${BASE_URL}/kpis`, { params });
    },
    // Params: { period, startDate, endDate }
    getRevenues(params) {
        return axiosClient.get(`${BASE_URL}/revenues`, { params });
    },
    // Params: { period, startDate, endDate }
    getOrderStatus(params) {
        return axiosClient.get(`${BASE_URL}/order-status`, { params });
    },
    // Params: { minStock } - Mặc định 10
    getLowStock(minStock = 10) {
        return axiosClient.get(`${BASE_URL}/low-stock`, { params: { minStock } });
    },
    // Params: { limit } - Mặc định 10
    getRecentOrders(limit = 10) {
        return axiosClient.get(`${BASE_URL}/recent-orders`, { params: { limit } });
    },
    // Params: { period, startDate, endDate, limit }
    getTopProducts(params) {
        return axiosClient.get(`${BASE_URL}/top-products`, { params });
    },
    // Params: { period, startDate, endDate }
    getRevenueByCategory(params) {
        return axiosClient.get(`${BASE_URL}/revenue-by-category`, { params });
    },
};

export default dashboardApis;
