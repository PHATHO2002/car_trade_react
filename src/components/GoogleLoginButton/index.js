import React from 'react';
import store from '~/redux/store';
import { GoogleLogin } from '@react-oauth/google';
import { loginApi } from '~/api/auth';
import { login } from '~/redux/slices/authSlice'; //reducer
import { jwtDecode } from 'jwt-decode';
const GoogleLoginButton = () => {
    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await loginApi(null, null, credentialResponse.credential);
            const accessToken = response.data.data.accessToken;
            const decodedUser = jwtDecode(accessToken);
            window.location.href = '/';
            store.dispatch(login({ decodedUser, accessToken }));
        } catch (error) {
            console.error(error);
        }
    };
    if (process.env.NODE_ENV == 'production') {
        return (
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                redirectUri="https://www.muabanotocu.click"
            />
        );
    } else {
        return (
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                redirectUri="http://localhost:3000"
            />
        );
    }
};

export default GoogleLoginButton;
