import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const categoryApi = {
    getAllCategory() {
        return axiosClient.get(ADMIN_ENDPOINTS.category);
    },
    addCategory(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.category, data);
    },
    deleteCategory(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.category}/${id}`);
    },
    updateCategory(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.category}/${id}`, data);
    },
};

export default categoryApi;