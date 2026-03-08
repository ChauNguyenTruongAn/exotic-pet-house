import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const userApi = {
    getAllUser() {
        return axiosClient.get(ADMIN_ENDPOINTS.user);
    },
    addUser(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.user, data);
    },
    updateUser(id, data) {
        return axiosClient.put(`${ADMIN_ENDPOINTS.user}/${id}`, data);
    },
    deleteUser(id) {
        return axiosClient.delete(`${ADMIN_ENDPOINTS.user}/${id}`);
    },
};

export default userApi;
