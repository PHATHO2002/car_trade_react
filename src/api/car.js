import api from './api';
export const getCarApi = async (query = null) => {
    try {
        let response;
        if (query) {
            response = await api.get(`/car?${query}`);
        } else {
            response = await api.get('/car');
        }
        return response;
    } catch (error) {
        throw error;
    }
};
export const deleteCarApi = async (id) => {
    try {
        const response = await api.delete(`car/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const searchCarApi = async (query) => {
    try {
        const response = await api.get(`car/search/${query}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const createCarApi = async (formData) => {
    try {
        const response = await api.post('/car', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response;
    } catch (error) {
        throw error;
    }
};
export const getCarBrandsApi = async () => {
    try {
        const response = await api.get('/car/brands');
        return response;
    } catch (error) {
        throw error;
    }
};
export const updateSaleStatusApi = async (id, data) => {
    try {
        const response = await api.patch(`/car/update-sale-status/${id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};
// //api dành cho admin
export const getCarPendingApi = async () => {
    try {
        const response = await api.get('/admin/car/pending');
        return response;
    } catch (error) {
        throw error;
    }
};
export const getBrandCountByMonthApi = async (month, year) => {
    try {
        const response = await api.get(`/admin/car/data-brand-count-month?month=${month}&year=${year}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const updateCarStatusApi = async (id, status) => {
    try {
        const response = await api.post('/admin/car/decision', { id, status });
        return response;
    } catch (error) {
        throw error;
    }
};
