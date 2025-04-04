import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from '~/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import GoogleLoginButton from '~/components/GoogleLoginButton';
import { loginApi } from '~/api/auth';

import React, { useState } from 'react';
const cx = classNames.bind(styles);
function Login() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const response = await loginApi(username, password);

            const accessToken = response.data.data.accessToken;
            const decodedUser = jwtDecode(accessToken);
            window.location.href = '/';
            dispatch(login({ decodedUser, accessToken })); // Cập nhật Redux state
        } catch (error) {
            console.log('check-login', error);
            setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại.');
        }
    };

    return (
        <>
            <div className={cx('wraper', 'row-nowrap')}>
                <div className={cx('welcome-img', 'col')}>
                    <img src="/images/welcome.webp" />
                </div>
                <div className={cx('login-form', 'col', 'flex-column')}>
                    <h3>Đăng nhập</h3>

                    <div className={cx('form-group')}>
                        <label for="username">Tên đăng nhập:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label for="pass">Mật khẩu:</label>
                        <input
                            type="password"
                            id="pass"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
                    <Button onClick={handleLogin} primary>
                        <p className={cx('login-btn')}>Đăng nhập</p>
                    </Button>
                    <div>
                        <span>Bạn chưa có tài khoản? </span>
                        <Link to="/register">Đăng Ký Ngay</Link>
                    </div>
                    <div className={cx('google-login-btn')}>
                        <GoogleLoginButton />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
