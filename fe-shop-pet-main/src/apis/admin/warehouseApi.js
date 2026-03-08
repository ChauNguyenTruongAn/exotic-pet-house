import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const warehouseApis = {
    getAllReceipt() {
        return axiosClient.get(ADMIN_ENDPOINTS.warehouse);
    },

    getAllProductByReceiptId(id) {
        return axiosClient.get(`${ADMIN_ENDPOINTS.warehouse}/${id}`);
    },

    createReceipt(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.warehouse, data);
    },

    updateDetailReceipt(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.warehouse}/${id}`, data);
    },

    updateReceipt(id, note, receiveTime) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.warehouse}/${id}/total?note=${note}&receiveTime=${receiveTime}`);
    },

    deleteDetailReceipt(id, productId) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.warehouse}/${id}/product/${productId}`);
    },

    deleteReceipt(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.warehouse}/${id}`);
    }
};

export default warehouseApis;
