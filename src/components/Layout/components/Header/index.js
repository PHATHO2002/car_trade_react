import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu';
import { useNavigate } from 'react-router-dom';
import api from '~/api/api';
import { connectSocket } from '~/utils/socket';
import {
    faMagnifyingGlass,
    faBell,
    faRightToBracket,
    faArrowUpFromBracket,
    faSignOut,
    faUser,
    faAddressBook,
    faNewspaper,
    faCartShopping,
    faComments,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import { logout } from '~/redux/slices/authSlice';

const cx = classNames.bind(styles);

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const userData = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            await api.post('/logout'); // Sử dụng instance API
            let socket = connectSocket();
            socket.disconnect(); // Gọi hàm ngắt kết nối
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Lỗi khi logout:', error);
            dispatch(logout());
        }
    };
    const userMenuItems = [
        {
            label: 'Giỏ hàng',
            to: '/user/cart',
            icon: <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />,
        },
        {
            label: 'Tin của bạn',
            icon: <FontAwesomeIcon className={cx('icon')} icon={faNewspaper} />,
        },
        {
            label: 'Đăng xuất',
            onClick: handleLogout,
            icon: <FontAwesomeIcon className={cx('icon')} icon={faSignOut} />,
        },
    ];
    const adminMenuItems = [
        {
            label: 'Xe chờ duyệt',
            to: '/admin/get-pendingCars',
            icon: <FontAwesomeIcon className={cx('icon')} icon={faAddressBook} />,
        },
        {
            label: 'Đăng xuất',
            onClick: handleLogout,
            icon: <FontAwesomeIcon className={cx('icon')} icon={faSignOut} />,
        },
    ];
    return isLoggedIn ? (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src="https://muaban.net/logo/muaban.svg" alt="Mua bán bất động sản" />
                </div>
                <div className={cx('search')}>
                    <input></input>
                    <div className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
                <div className={cx('actions')}>
                    <div className={cx('mess-notification')}>
                        <FontAwesomeIcon icon={faComments} />
                    </div>
                    <div className={cx('notification')}>
                        <FontAwesomeIcon icon={faBell} />
                    </div>

                    <div className={cx('profile')}>
                        <div className={cx('profile-icon')}>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span className={cx('profile-name')}>{userData.username}</span>
                        {userData.role === 'admin' ? (
                            <div>
                                <DropdownMenu title={userData.role} items={adminMenuItems} />
                            </div>
                        ) : (
                            <div>
                                <DropdownMenu title={userData.role} items={userMenuItems} />
                            </div>
                        )}
                    </div>
                    <div className={cx('post')}>
                        <Button rightIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />} to="/user/post" primary>
                            Đăng Tin
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src="https://muaban.net/logo/muaban.svg" alt="Mua bán bất động sản" />
                </div>
                <div className={cx('search')}>
                    <input></input>
                    <div className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                </div>
                <div className={cx('actions')}>
                    <Link className={cx('login')} to="/login">
                        <FontAwesomeIcon icon={faRightToBracket} />
                        <span>Đăng nhập</span>
                    </Link>

                    <div className={cx('post')}>
                        <Button rightIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />} to="/login" primary>
                            Đăng Tin
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Header;
