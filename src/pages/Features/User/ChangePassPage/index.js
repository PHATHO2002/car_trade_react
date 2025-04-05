import classNames from 'classnames/bind';
import styles from './ChangePassPage.module.scss';
import { useState } from 'react';
import Button from '~/components/Button';
import { updatePasswordApi } from '~/api/user';
const cx = classNames.bind(styles);
export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleChangePassword = async () => {
        setError('');
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('nhập đầy đủ thông tin');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('mât khẩu mới không khớp');
            return;
        }
        try {
            await updatePasswordApi(oldPassword, newPassword);
            setSuccessMessage('Đổi mật khẩu thành công');
        } catch (error) {
            setError(`${error.response.data.message}`);
        }
    };

    return (
        <div>
            <h3>Đổi mật khẩu</h3>
            <div>
                <input
                    type="password"
                    placeholder="mât khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <p className={cx('error-message')}>{error}</p>}
                {successMessage && <p className={cx('success-message')}>{successMessage}</p>}
                <Button primary onClick={handleChangePassword}>
                    Đổi mật khẩu
                </Button>
            </div>
        </div>
    );
}
