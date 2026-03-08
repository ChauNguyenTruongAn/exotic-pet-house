import axiosClient from "./axiosClient";
import { ENDPOINTS } from "./endpoint";

const geoApi = {
    getProvince() {
        return axiosClient.get(`${ENDPOINTS.geo}/provinces?limit=63`);
    },
    getDistrict(provinceCode) {
        return axiosClient.get(`${ENDPOINTS.geo}/provinces/${provinceCode}/districts`);
    },

    getWards(districtCode){
        return axiosClient.get(`${ENDPOINTS.geo}/districts/${districtCode}/wards`);
    }
};

export default geoApi;