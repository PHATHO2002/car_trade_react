// Layouts

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Post';
import Search from '~/pages/Search';
import Login from '~/pages/login';
import Register from '~/pages/register';
import Post from '~/pages/Post';
import PendingProducts from '~/pages/Features/Admin/PendingCars/PendingCars';
// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/profile', component: Profile },
    { path: '/search', component: Search, layout: null },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
];

const privateRoutes = [{ path: '/post', component: Post }];
const adminRoutes = [{ path: '/admin/get-pendingCars', component: PendingProducts }];

export { publicRoutes, privateRoutes, adminRoutes };
