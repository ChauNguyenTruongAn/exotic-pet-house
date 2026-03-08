import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const cartApis = {
    getCart() {
        return axiosClient.get(ENDPOINTS.cart);
    },

    addProductToCart(data) {
        return axiosClient.post(ENDPOINTS.cart, data);
    },
    updateProductFromCart(data) {
        console.log(data);
        return axiosClient.put(ENDPOINTS.cart, data);
    },
    deleteProductFromCart(id) {
        return axiosClient.delete(`${ENDPOINTS.cart}/${id}`);
    },
    clearCart() {
        return axiosClient.put(`${ENDPOINTS.cart}/clear`);
    },
};

export default cartApis;
