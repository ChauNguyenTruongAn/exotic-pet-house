import axiosClient from '../axiosClient';
import { ADMIN_ENDPOINTS } from './endpoints';

const uploadImageApis = {
    uploadImage(data) {
        return axiosClient.post(ADMIN_ENDPOINTS.uploadImage, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default uploadImageApis;
