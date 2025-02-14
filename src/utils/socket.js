import { io } from 'socket.io-client';
import store from '~/redux/store';

let socket;

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

        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });
    }
    return socket;
};
// store.subscribe(() => {
//     socket.auth.token = store.getState().auth.accessToken;
// });
export { connectSocket };
