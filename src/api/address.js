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
export const getCoordinatesApi = async (city) => {
    try {
        const apiKey = process.env.REACT_APP_TOMTOM_API_KEY;
        const response = await axios.get(
            `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(city)}.json?key=${apiKey}`,
        );

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].position; // { lat, lon }
        } else {
            throw new Error('Không tìm thấy tọa độ.');
        }
    } catch (error) {
        throw error;
    }
};
