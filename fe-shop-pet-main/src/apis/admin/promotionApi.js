import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const promotionApi = {
    getAllPromotion() {
        return axiosClient.get(ADMIN_ENDPOINTS.promotion);
    },
    addPromotion(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.promotion, data);
    },
    updatePromotion(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.promotion}/${id}`, data);
    },
    deletePromotion(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.promotion}/${id}`);
    },
};

export default promotionApi;
