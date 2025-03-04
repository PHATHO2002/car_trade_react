import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faNewspaper, faSignOut, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

const cx = classNames.bind();

export const userMenuItems = [
    {
        label: 'Giỏ hàng',
        to: '/user/cart',
        icon: <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />,
    },
    {
        label: 'Tin của bạn',
        to: '/user/own-post',
        icon: <FontAwesomeIcon className={cx('icon')} icon={faNewspaper} />,
    },
    {
        label: 'Đăng xuất',
        onClick: () => console.log('User logout'), // Thay handleLogout khi import
        icon: <FontAwesomeIcon className={cx('icon')} icon={faSignOut} />,
    },
];

export const adminMenuItems = [
    {
        label: 'Xe chờ duyệt',
        to: '/admin/get-pendingCars',
        icon: <FontAwesomeIcon className={cx('icon')} icon={faAddressBook} />,
    },
    {
        label: 'Đăng xuất',
        onClick: () => console.log('Admin logout'), // Thay handleLogout khi import
        icon: <FontAwesomeIcon className={cx('icon')} icon={faSignOut} />,
    },
];
