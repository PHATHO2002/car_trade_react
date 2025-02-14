// Layouts

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Features/User/Post';
import Search from '~/pages/Search';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Post from '~/pages/Features/User/Post';
import PendingProducts from '~/pages/Features/Admin/PendingCars/PendingCars';
import Cart from '~/pages/Features/User/Cart/Cart';
// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/profile', component: Profile },
    { path: '/search', component: Search, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
];

const privateRoutes = [
    { path: '/user/post', component: Post },
    { path: '/user/cart', component: Cart },
];
const adminRoutes = [{ path: '/admin/get-pendingCars', component: PendingProducts }];

export { publicRoutes, privateRoutes, adminRoutes };
