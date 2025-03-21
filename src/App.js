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
import ChatBox from './components/ChatBox/ChatBox';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [receiverIdList, setReceiverIdList] = useState([]); //it was made to render list chatbox
    const handleOpenChatBox = (receiId, username) => {
        setReceiverIdList((prev) =>
            prev.some((item) => item.receiId === receiId) ? prev : [...prev, { receiId, username }],
        );
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };
    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response = await api.post('/refreshToken', {});
                dispatch(setAccessToken(response.data.accessToken));
            } catch (error) {
                console.log('Lỗi refresh token:', error);
                // dispatch(logout());
            } finally {
                setLoading(false);
            }
        };
        if (isLoggedIn && !accessToken) {
            fetchAccessToken();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);
    useEffect(() => {
        if (isLoggedIn && accessToken) {
            const socket = connectSocket(); // ✅ Connect socket khi có token
            socket.on('receive_message', (data) => {
                const { senderId, username } = data;
                handleOpenChatBox(senderId, username);
            }); //automatically generated chat box when a message arrives

            return () => {
                socket.disconnect(); // ✅ Cleanup để tránh rò rỉ kết nối
            };
        }
    }, [accessToken]);
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <Router>
            <GoogleOAuthProvider clientId="414614463550-dpcso01i0f237qjk76c30iva5vh7vcmj.apps.googleusercontent.com">
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

                    {receiverIdList.slice(-2).map((item) => (
                        <ChatBox
                            key={item.receiId}
                            receiverId={item.receiId}
                            username={item.username}
                            closeChatBox={closeChatBox}
                        />
                    ))}
                </div>
            </GoogleOAuthProvider>
        </Router>
    );
}

export default App;
