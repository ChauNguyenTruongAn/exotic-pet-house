import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const orderApi = {
    getAllOrder() {
        return axiosClient.get(ADMIN_ENDPOINTS.order);
    },
    addOrder(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.order, data);
    },

    updateOrder(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.order}/${id}`, data);
    },
    deleteOrder(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.order}/${id}`);
    },
};

export default orderApi;
