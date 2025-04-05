import api from './api';

export const sendMessApi = async (receiverId, message) => {
    try {
        const response = await api.post('/chat', { receiverId, message });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getChatPartnersApi = async () => {
    try {
        const response = await api.get('/chat/list-partner');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUnreadMessagesApi = async () => {
    try {
        const response = await api.get('/chat?unRead=1');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getMessWithPartnerApi = async (receiverId) => {
    try {
        const response = await api.get(`/chat?receiverId=${receiverId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const markReadedApi = async (unReadedMess) => {
    try {
        const response = await api.patch('/chat/', { unReadedMess });
        return response;
    } catch (error) {
        throw error;
    }
};
