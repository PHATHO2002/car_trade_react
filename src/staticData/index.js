import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faNewspaper, faSignOut, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { connectSocket } from '~/utils/socket';
import { logoutApi } from '~/api/auth';
import { useDispatch } from 'react-redux';
import { logout } from '~/redux/slices/authSlice';

// ✅ Correct way: Convert to a custom hook
const useMenuHandlers = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await logoutApi();
            let socket = connectSocket();
            socket.disconnect();
            dispatch(logout());
            window.location.href = '/';
        } catch (error) {
            console.error('Lỗi khi logout:', error);
            dispatch(logout());
        }
    };

    return { handleLogout };
};

// ✅ Export as hooks to be used inside components

export const useUserMenuItems = () => {
    const { handleLogout } = useMenuHandlers();

    return [
        {
            label: 'Giỏ hàng',
            to: '/user/cart',
            icon: <FontAwesomeIcon icon={faCartShopping} />,
        },
        {
            label: 'Tin của bạn',
            to: '/user/own-post',
            icon: <FontAwesomeIcon icon={faNewspaper} />,
        },
        {
            label: 'Đăng xuất',
            onClick: handleLogout, // ✅ No need for extra function wrapper
            icon: <FontAwesomeIcon icon={faSignOut} />,
        },
    ];
};

export const useAdminMenuItems = () => {
    const { handleLogout } = useMenuHandlers();

    return [
        {
            label: 'Xe chờ duyệt',
            to: '/admin/get-pendingCars',
            icon: <FontAwesomeIcon icon={faAddressBook} />,
        },
        {
            label: 'Đăng xuất',
            onClick: handleLogout, // ✅ No need for extra function wrapper
            icon: <FontAwesomeIcon icon={faSignOut} />,
        },
    ];
};
