import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from '~/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '~/api/api';

import React, { useState } from 'react';
const cx = classNames.bind(styles);
function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const response = await api.post('/login', { username, password }); // Sử dụng instance API
            const accessToken = response.data.data.accessToken;
            const decodedUser = jwtDecode(accessToken);

            dispatch(login({ decodedUser, accessToken })); // Cập nhật Redux state
            navigate('/'); // Điều hướng về trang chính
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || 'Đăng nhập thất bại.');
        }
    };

    return (
        <>
            <div className={cx('login-page')}>
                <div className={cx('login-container')}>
                    <div className={cx('welcome-img')}>
                        <img src="/images/welcome.webp" />
                    </div>
                    <div className={cx('login-form')}>
                        <h2>Đăng nhập</h2>

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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
