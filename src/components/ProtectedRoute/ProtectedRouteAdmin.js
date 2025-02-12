import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRouteAdmin = ({ element }) => {
    const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
    const userData = useSelector((state) => state.auth.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!userData || userData.role !== 'admin') {
        return <Navigate to="/" />; // Điều hướng nếu không phải admin
    }

    return element;
};

export default ProtectedRouteAdmin;
