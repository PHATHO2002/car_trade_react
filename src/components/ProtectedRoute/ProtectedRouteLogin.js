import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRouteLogin = ({ element }) => {
    const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
    console.log(isAuthenticated);
    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRouteLogin;
