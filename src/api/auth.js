import api from './api';
export const loginApi = async (username, password, credential) => {
    try {
        if (credential) {
            const response = await api.post('/login/google', { credential: credential });
            return response;
        }
        const response = await api.post('/login', { username, password });

        return response;
    } catch (error) {
        throw error;
    }
};
export const logoutApi = async () => {
    try {
        const response = await api.post('/logout');
        return response;
    } catch (error) {
        throw error;
    }
};
