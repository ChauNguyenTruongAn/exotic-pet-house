import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const productApi = {
    getAllProduct() {
        return axiosClient.get(ADMIN_ENDPOINTS.product);
    },
    addProduct(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.product, data);
    },
    updateProduct(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.product}/${id}`, data);
    },
    deleteProduct(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.product}/${id}`);
    },
};

export default productApi;
