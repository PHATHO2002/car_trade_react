import axios from 'axios';
import store from '../redux/store';
import { setAccessToken } from '~/redux/slices/authSlice';
import { logout } from '~/redux/slices/authSlice';

// Tạo instance Axios
const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Để gửi cookie (refreshToken)
});

// Biến lưu Promise refreshToken để tránh gọi nhiều lần cùng lúc
let refreshTokenRequest = null;

// Hàm gọi API refresh token
const refreshAccessToken = async () => {
    if (!refreshTokenRequest) {
        refreshTokenRequest = api
            .post('/refreshToken')
            .then((response) => {
                console.log(response);
                store.dispatch(setAccessToken(response.data.accessToken)); // Lưu vào Redux
                return response.data.accessToken;
            })
            .catch((error) => {
                store.dispatch(logout()); // Xóa Redux state nếu lỗi
                window.location.href = '/login'; // Chuyển hướng về trang login
                return Promise.reject(error);
            })
            .finally(() => {
                refreshTokenRequest = null; // Reset biến khi hoàn thành
            });
    }
    return refreshTokenRequest;
};

// Interceptor thêm accessToken vào mỗi request
api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken; // Lấy token từ Redux
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Interceptor để xử lý lỗi 401 (Token hết hạn)
api.interceptors.response.use(
    (response) => response, // Trả về response nếu không lỗi
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 do token hết hạn và request chưa thử refresh token
        if (
            error.response?.status === 401 &&
            error.response?.data?.message === 'jwt expired' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // Đánh dấu đã thử refresh
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                // console.log('test auto refresh token');
                // console.log(newAccessToken);
                return api(originalRequest); // Gửi lại request với token mới
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
