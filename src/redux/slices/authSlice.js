import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth', // Tên của slice
    initialState: {
        isLoggedIn: !!localStorage.getItem('userData'),
        user: JSON.parse(localStorage.getItem('userData')) || null,
        accessToken: null,
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload.decodedUser;
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('userData', JSON.stringify(action.payload.decodedUser));
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.accessToken = null;
            localStorage.clear();
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload; // Lưu vào Redux state
        },
        clearAccessToken(state) {
            state.accessToken = null; // Xóa khỏi Redux state
        },
    },
});

export const { login, logout, setAccessToken, clearAccessToken } = authSlice.actions; // Trích xuất các action creators
export default authSlice.reducer; // Export reducer
