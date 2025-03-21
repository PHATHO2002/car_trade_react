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
export const registerUserApi = async (username, password) => {
    try {
        const response = await api.post('/user', { username, password });
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
