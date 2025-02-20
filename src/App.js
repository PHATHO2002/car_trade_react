import { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken } from './redux/slices/authSlice';
import { publicRoutes, privateRoutes, adminRoutes } from '~/routes';
import { useSelector } from 'react-redux';
import { DefaultLayout } from '~/components/Layout';
import { logout } from '~/redux/slices/authSlice';
import { connectSocket } from './utils/socket';
import ProtectedRouteLogin from './components/ProtectedRoute/ProtectedRouteLogin';
import ProtectedRouteAdmin from './components/ProtectedRoute/ProtectedRouteAdmin';
import api from './api/api';

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const accessToken = useSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response = await api.post('/refreshToken', {});
                dispatch(setAccessToken(response.data.accessToken));
            } catch (error) {
                console.log('Lỗi refresh token:', error);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };
        if (isLoggedIn) {
            if (!accessToken) {
                fetchAccessToken();
            } else {
                // connectSocket();
            }
        }

        setLoading(false);
    }, [accessToken, isLoggedIn]);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}

                    {/* Private Routes */}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectedRouteLogin
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                }
                            />
                        );
                    })}
                    {adminRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectedRouteAdmin
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
