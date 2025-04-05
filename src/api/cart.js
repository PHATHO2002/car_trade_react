import api from './api';
export const addToCartApi = async (carId) => {
    try {
        const response = await api.post('/cart', { carId });
        return response;
    } catch (error) {
        throw error;
    }
};
export const getCartApi = async () => {
    try {
        const response = await api.get('/cart');
        return response;
    } catch (error) {
        throw error;
    }
};
export const removeFromCartApi = async (carId) => {
    try {
        const response = await api.delete(`/cart/${carId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
