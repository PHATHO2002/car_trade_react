import { io } from 'socket.io-client';
import store from '~/redux/store';
import api from '~/api/api';
import { setAccessToken } from '~/redux/slices/authSlice';
import { logout } from '~/redux/slices/authSlice';
let socket;
// Hàm gọi API refresh token
let refreshTokenRequest = null;
const refreshAccessToken = async () => {
    if (!refreshTokenRequest) {
        refreshTokenRequest = api
            .post('/refreshToken')
            .then((response) => {
                store.dispatch(setAccessToken(response.data.accessToken)); // Lưu vào Redux
                return response.data.accessToken;
            })
            .catch((error) => {
                console.log(error);
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
const connectSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            auth: {
                token: store.getState().auth.accessToken, // Lấy token khi connect
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        // Log sự kiện kết nối
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('connect_error', async (err) => {
            if (err.message.includes('TokenExpiredError')) {
                try {
                    // Gọi API refresh token
                    const newAccessToken = await refreshAccessToken();
                    // Cập nhật token vào Redux
                    store.dispatch(setAccessToken(newAccessToken));

                    // Gán lại token mới cho socket và kết nối lại
                    socket.auth.token = newAccessToken;
                    socket.connect();
                } catch (refreshError) {
                    console.log('🔴 Refresh token to connect socket failed');
                }
            }
            console.error('❌ Socket connection error:', err.message);
        });
    }
    return socket;
};
store.subscribe(() => {
    if (socket) {
        socket.auth.token = store.getState().auth.accessToken;
    }
});
export { connectSocket };
