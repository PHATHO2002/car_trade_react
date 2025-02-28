// Layouts

// Pages
import Home from '~/pages/Home';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Post from '~/pages/Features/User/Post';
import PendingProducts from '~/pages/Features/Admin/PendingCars/PendingCars';
import Cart from '~/pages/Features/User/Cart/Cart';
import OwnPost from '~/pages/Features/User/OwnPost/OwnPost';
// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
];

const privateRoutes = [
    { path: '/user/post', component: Post },
    { path: '/user/cart', component: Cart },
    { path: '/user/own-post', component: OwnPost },
];
const adminRoutes = [{ path: '/admin/get-pendingCars', component: PendingProducts }];

export { publicRoutes, privateRoutes, adminRoutes };
