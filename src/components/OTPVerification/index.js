import { useState } from 'react';
import OtpInput from 'react-otp-input';
import Button from '../Button';
import classNames from 'classnames/bind';
import styles from './OTPVerification.module.scss';
const cx = classNames.bind(styles);
export default function OTPVerification({ sendOtp }) {
    const [otp, setOtp] = useState('');

    return (
        <div className={cx('wraper', 'flex-column')}>
            <h3>Nhập mã OTP</h3>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus={true}
                renderInput={(props) => <input {...props} style={{ color: 'black', textAlign: 'center' }} />}
                inputStyle={{
                    width: '4rem',
                    height: '4rem',
                    fontSize: '1.8rem',
                    margin: '0.5rem',
                    borderRadius: '8px', // Bo góc nhẹ
                    border: '1px solid #ccc', // Viền rõ hơn
                    backgroundColor: 'white', // Tránh bị trong suốt
                    outline: 'none', // Bỏ viền xanh khi click vào
                    color: 'black', // Đảm bảo màu chữ là đen
                }}
            />

            <Button primary onClick={() => sendOtp(otp)}>
                Xác nhận OTP
            </Button>
        </div>
    );
}
