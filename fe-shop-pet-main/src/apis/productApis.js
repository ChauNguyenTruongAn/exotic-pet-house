import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const productApi = {
    getAllProduct() {
        return axiosClient.get(ENDPOINTS.product);
    },

    getAllProductByFilter(params) {
        return axiosClient.get(`${ENDPOINTS.product}/filter`, { params });
    },

    getProductById(id) {
        return axiosClient.get(`${ENDPOINTS.product}/${id}`);
    },

    getProductRelatedById(speciesId){
        return axiosClient.get(`${ENDPOINTS.product}/species/${speciesId}`)
    },

    get3LatestProduct() {
        return axiosClient.get(`${ENDPOINTS.product}/latest`);
    },
};

export default productApi;
