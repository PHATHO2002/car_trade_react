import { useSelector } from 'react-redux';
import AdminHomePage from '../Features/Admin/AdminHomePage';
import UserHomePage from '../Features/User/UserHomePage/UserHomePage';
function Home() {
    const userData = useSelector((state) => state.auth.user);
    return <>{userData?.role === 'admin' ? <AdminHomePage /> : <UserHomePage />}</>;
}

export default Home;
