import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu';
import ChatPartnerList from '~/components/ChatList/ChatList';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faRightToBracket, faArrowUpFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import { useUserMenuItems, useAdminMenuItems } from '~/staticData';
const cx = classNames.bind(styles);

function Header() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const userData = useSelector((state) => state.auth.user);
    const userMenuItems = useUserMenuItems();
    const adminMenuItems = useAdminMenuItems();
    return isLoggedIn ? (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <img src="\images\logo-removebg.svg" alt="Mua bán xe ô tô" />
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
                                <FontAwesomeIcon icon={faCircleUser} /> <span>{userData.username}</span>
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
                            <Link to="/user/post">
                                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/Personal">
                                <FontAwesomeIcon icon={faCircleUser} />
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
                    <img src="\images\logo-removebg.svg" alt="Mua bán xe ô tô" />
                </div>

                <div className={cx('actions')}>
                    <Link className={cx('login')} to="/login">
                        <Button primary>
                            <FontAwesomeIcon icon={faRightToBracket} />
                            <span>Đăng nhập</span>
                        </Button>
                    </Link>
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
                            <Link to="/login">
                                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
                                <FontAwesomeIcon icon={faCircleUser} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default Header;
