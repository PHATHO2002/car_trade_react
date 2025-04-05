import api from './api';
export const getUserApi = async (query = null) => {
    try {
        let response;
        if (query) {
            response = await api.get(`/user?${query}`);
        } else {
            response = await api.get('/user');
        }
        return response;
    } catch (error) {
        throw error;
    }
};
export const registerUserApi = async (email, username, password, otp) => {
    try {
        const response = await api.post('/user', { email, username, password, otp });
        return response;
    } catch (error) {
        throw error;
    }
};
export const sendOtpForRegistrationApi = async (email, username, password) => {
    try {
        const response = await api.post('user/register/send-otp', { email, username, password });
        return response;
    } catch (error) {
        throw error;
    }
};
export const updateUserApi = async (updateData) => {
    try {
        const response = await api.patch('/user', updateData);
        return response;
    } catch (error) {
        throw error;
    }
};
export const updatePasswordApi = async (oldPassword, newPassword) => {
    try {
        const response = await api.patch('/user/change-pass', { oldPassword, newPassword });
        return response;
    } catch (error) {
        throw error;
    }
};
