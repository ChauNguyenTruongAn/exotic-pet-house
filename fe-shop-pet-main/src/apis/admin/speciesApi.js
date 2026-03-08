import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const speciesApi = {
    getAllSpecies() {
        return axiosClient.get(ADMIN_ENDPOINTS.species);
    },
    addSpecies(item) {
        return axiosClient.post(`${ADMIN_ENDPOINTS.category}/${item.categoryId}/species`, item.name);
    },
    updateSpecies(data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.species}/${data.id}`, data);
    },
    deleteSpecies(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.species}/${id}`);
    },
};

export default speciesApi;
