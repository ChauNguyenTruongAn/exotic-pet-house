import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const orderApis = {
    createOrder(data) {
        return axiosClient.post(ENDPOINTS.order, data);
    },

    getPaymentLink(amount, orderId) {
        return axiosClient.get(`${ENDPOINTS.vnpay}?amount=${amount}&orderId=${orderId}`);
    },

    getMyOrder(id) {
        return axiosClient.get(`${ENDPOINTS.order}/my/${id}`);
    },

    getAllOrder() {
        return axiosClient.get(`${ENDPOINTS.order}/my`);
    },

    checkOrder(data) {
        return axiosClient.post(`${ENDPOINTS.order}/check`, data);
    },
    cancelOrder(id) {
        return axiosClient.put(`${ENDPOINTS.order}/my/${id}`);
    },
};

export default orderApis;
