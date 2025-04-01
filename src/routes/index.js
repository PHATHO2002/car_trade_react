// Layouts

// Pages
import Home from '~/pages/Home';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Post from '~/pages/Features/User/Post';
import PendingProducts from '~/pages/Features/Admin/PendingCars/PendingCars';
import Cart from '~/pages/Features/User/Cart/Cart';
import Personal from '~/pages/Features/User/Personal';
import OwnPost from '~/pages/Features/User/OwnPost/OwnPost';
import DetailCar from '~/pages/Features/Car/DetailCarPage';
import ChangePassword from '~/pages/Features/User/ChangePassPage';
// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/car/:id', component: DetailCar },
];

const privateRoutes = [
    { path: '/user/post', component: Post },
    { path: '/user/cart', component: Cart },
    { path: '/user/Personal', component: Personal },
    { path: '/user/own-post', component: OwnPost },
    { path: '/user/change-pass', component: ChangePassword },
];
const adminRoutes = [{ path: '/admin/get-pendingCars', component: PendingProducts }];

export { publicRoutes, privateRoutes, adminRoutes };
