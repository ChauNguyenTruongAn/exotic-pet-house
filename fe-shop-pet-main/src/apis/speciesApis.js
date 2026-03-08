import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const speciesApis = {
    getAllSpecies() {
        return axiosClient.get(ENDPOINTS.species);
    },
};

export default speciesApis;
