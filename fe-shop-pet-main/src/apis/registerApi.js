import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const registerApi = {
    register(data) {
        console.log(data);
        const registerData = {
            fullName: data.fullName,
            username: data.email,
            email: data.email,
            password: data.confirmPassword,
            phoneNumber: data.phone,
            address: data.address,
        };
        return axiosClient.post(ENDPOINTS.register, registerData);
    },
};

export default registerApi;
