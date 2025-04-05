import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import OTPVerification from '~/components/OTPVerification';
import { sendOtpForRegistrationApi, registerUserApi } from '~/api/user';

const cx = classNames.bind(styles);

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [FormConfirmEmail, setFormConfirmEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpTimeout, setOtpTimeout] = useState(0);

    const handleSendOtpForRegister = async () => {
        if (!username || !password || !email) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            setErrorMessage('Email không hợp lệ !');
            return;
        }
        if (/\s/.test(username)) {
            setErrorMessage('Tên đăng nhập không được có khoảng trắng.');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        try {
            const rp = await sendOtpForRegistrationApi(email, username, password);
            setOtpTimeout(rp.data.data.exprireTime);
            const intervalId = setInterval(() => {
                setOtpTimeout((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalId); // Dừng khi giá trị otpTimeout = 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setErrorMessage('');
            setFormConfirmEmail(true);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || 'Đã xảy ra lỗi');
        }
    };
    const handleRegister = async (otp) => {
        try {
            const rp = await registerUserApi(email, username, password, otp);
            setSuccessMessage(rp.data.message);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || 'Đã xảy ra lỗi');
        }
    };

    return (
        <div className={cx('wraper', 'row-nowrap')}>
            <div className={cx('welcome-img', 'col')}>
                <img src="/images/welcome.webp" alt="Welcome" />
            </div>
            {FormConfirmEmail ? (
                <div className={cx('register-form', 'col')}>
                    <p className={cx('success-message')}>
                        Chúng tôi đã gửi mã otp đến email vui lòng kiểm tra và nhập vào mã otp bạn đã nhận được, vì
                        chúng tôi sử dụng dịch vụ free nên mã gửi đến hơi vui lòng chờ tý nhé !
                    </p>
                    <OTPVerification sendOtp={handleRegister} />
                    {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
                    {successMessage && <p className={cx('success-message')}>{successMessage}</p>}
                    {otpTimeout === 0 ? (
                        <Button onClick={handleSendOtpForRegister} primary>
                            Gửi lại mã otp
                        </Button>
                    ) : (
                        <p className={cx('success-message')}>thời gian otp còn hiệu lực {otpTimeout} s</p>
                    )}
                </div>
            ) : (
                <div className={cx('register-form', 'col')}>
                    <h3>Đăng ký</h3>

                    <div className={cx('form-group', 'flex-column')}>
                        <label htmlFor="username">Gmail</label>
                        <input
                            type="email"
                            id="username"
                            placeholder="Nhập gmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
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

                    {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
                    {successMessage && <p className={cx('success-message')}>{successMessage}</p>}

                    <Button onClick={handleSendOtpForRegister} primary>
                        <p className={cx('register-btn')}>Đăng ký</p>
                    </Button>
                    <div>
                        <span>Bạn đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập Ngay</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;
