import axios from 'axios';

export const getProvincesApi = async () => {
    try {
        const response = await axios.get('https://provinces.open-api.vn/api/p');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getProvinceDetailApi = async (provinceCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const getProvinceWithDistrictsApi = async (provinceCode) => {
    try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        return response;
    } catch (error) {
        throw error;
    }
};
