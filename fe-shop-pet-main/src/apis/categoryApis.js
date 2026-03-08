import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const categoryApis = {
    getAllCategories() {
        return axiosClient.get(ENDPOINTS.category);
    },
};

export default categoryApis;
