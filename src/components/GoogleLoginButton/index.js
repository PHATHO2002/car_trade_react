import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = ({ onSuccess }) => {
    const handleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential; // Lấy Google ID Token
            const res = await axios.post('http://localhost:5000/auth/google', { token });

            // Nhận token từ server & lưu vào localStorage
            localStorage.setItem('accessToken', res.data.accessToken);

            // Callback để cập nhật trạng thái đăng nhập
            // onSuccess(res.data.user);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />;
};

export default GoogleLoginButton;
