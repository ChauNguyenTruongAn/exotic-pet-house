import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const loginApi = {
    login(credentials) {
        return axiosClient.post(ENDPOINTS.login, credentials);
    },

    me() {
        return axiosClient.get(ENDPOINTS.me);
    },

    update(info) {
        return axiosClient.put(ENDPOINTS.me, info);
    },

    changePassword(info) {
        return axiosClient.put(`${ENDPOINTS.me}/password`, info);
    },

    forgotPassword(email) {
        return axiosClient.put(`auth/reset-password`, { email });
    }
};

export default loginApi;
