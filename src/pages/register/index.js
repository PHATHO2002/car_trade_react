import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = () => {
        if (!username || !password || !confirmPassword) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        axios
            .post('http://localhost:5000/user/register', { username, password })
            .then((response) => {
                setErrorMessage('đăng ký thành công');
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message);
            });
        setErrorMessage(''); // Xóa thông báo lỗi nếu hợp lệ
    };

    return (
        <div className={cx('register-page')}>
            <div className={cx('register-container', 'row-nowrap')}>
                <div className={cx('welcome-img', 'col')}>
                    <img src="/images/welcome.webp" alt="Welcome" />
                </div>
                <div className={cx('register-form', 'col')}>
                    <h2>Đăng ký</h2>

                    <div className={cx('form-group', 'flex-column')}>
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={cx('form-group', 'flex-column')}>
                        <label htmlFor="password">Mật khẩu:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={cx('form-group', 'flex-column')}>
                        <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}

                    <Button onClick={handleRegister} primary>
                        <p className={cx('register-btn')}>Đăng ký</p>
                    </Button>
                    <div>
                        <span>Bạn đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập Ngay</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
