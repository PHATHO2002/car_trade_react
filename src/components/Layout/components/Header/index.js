import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu';
import ChatPartnerList from '~/components/ChatList/ChatList';
import { useNavigate } from 'react-router-dom';
import api from '~/api/api';
import { connectSocket } from '~/utils/socket';
import {
    faRightToBracket,
    faArrowUpFromBracket,
    faSignOut,
    faUser,
    faAddressBook,
    faNewspaper,
    faCartShopping,
    faHouse,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import Search from '~/components/Search/search';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import { logout } from '~/redux/slices/authSlice';
import { userMenuItems, adminMenuItems } from '~/staticData';
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

    return isLoggedIn ? (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src="https://muaban.net/logo/muaban.svg" alt="Mua bán bất động sản" />
                </div>
                <div className={cx('search')}>
                    <Search />
                </div>
                <div className={cx('actions')}>
                    <div className={cx('home')}>
                        <Link to="/">
                            <FontAwesomeIcon icon={faHouse} />
                        </Link>
                    </div>
                    <div className={cx('mess-notification')}>
                        <ChatPartnerList />
                    </div>
                    <div className={cx('personal')}>
                        <Link to="/user/Personal">
                            <div className={cx('profile')}>
                                <FontAwesomeIcon icon={faUser} />
                                <span>{userData.username}</span>
                            </div>
                        </Link>
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
                <div className={cx('bottom-header')}>
                    {/* //appeared when this web on mobile */}
                    <ul className={cx('bottom-menu')}>
                        <li>
                            <Link to="/">
                                <FontAwesomeIcon icon={faHouse} />
                            </Link>
                        </li>
                        <li>
                            <ChatPartnerList />
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </li>
                        <li>
                            <Link to="/user/post">
                                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/Personal">
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                        </li>
                    </ul>
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
                    <Search />
                </div>
                <div className={cx('actions')}>
                    <Link className={cx('login')} to="/login">
                        <FontAwesomeIcon icon={faRightToBracket} />
                        <span>Đăng nhập</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default Header;
