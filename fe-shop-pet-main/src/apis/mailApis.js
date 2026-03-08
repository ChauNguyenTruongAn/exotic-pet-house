import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoint';

const mailApis = {
    sendMail(data) {
        return axiosClient.post(ENDPOINTS.mail, data);
    },
};
export default mailApis;
