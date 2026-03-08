import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const promotionApis = {
    getPromotionByCode(code) {
        return axiosClient.get(`${ENDPOINTS.promotion}/${code}`);
    },

    getPromotionByFooter(email) {
        return axiosClient.post(`${ENDPOINTS.promotion}/footer`, { email });
    },

    getPromotionByMinigame(){
        return axiosClient.post(`${ENDPOINTS.promotion}/minigame`);
    }
};

export default promotionApis;
