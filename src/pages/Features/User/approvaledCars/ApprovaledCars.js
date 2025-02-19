import classNames from 'classnames/bind';
import { use, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import api from '~/api/api';
import styles from './ApprovaledCars.module.scss';
import { faCartShopping, faL, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { connectSocket } from '~/utils/socket';
import ChatBox from '~/components/ChatBox';
const cx = classNames.bind(styles);

const ApprovaledCars = () => {
    const [carList, setCarList] = useState([]);
    const [cartIdList, setcartsId] = useState([]);
    const [usersOnline, setUserOnline] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [receiverIdList, setReceiverIdList] = useState([]); // để render list chatbox
    const accessToken = useSelector((state) => state.auth.accessToken);

    let socket;

    const itemsPerPage = 4; // Số xe hiển thị mỗi trang

    const fetchAproveldCars = async () => {
        try {
            const response = await api.post('/user/get-selling-car');
            const response2 = await api.post('/user/get-cart');
            setCarList(response.data.data);
            let cartIds = response2.data.data.carIds.map((item) => item._id);
            setcartsId(cartIds);
        } catch (error) {
            console.log(error);
        }
    };

    const handAddToCart = async (carId) => {
        try {
            await api.post('/user/add-to-cart', { carId: carId });
            toast.success('thêm vào giỏ hàng thành công');
        } catch (error) {
            console.log(error);
            toast.error('thêm vào giỏ hàng thất bại');
        }
    };
    const handlePrice = (number) => {
        const formattedPrice = number.toLocaleString('de-DE');
        return formattedPrice;
    };
    const handlePageChange = (event) => {
        setCurrentPage(event.selected);
    };
    const handleUserOnline = (usersOnline, sellerId) => {
        const userOn = usersOnline.find((user) => user.userId === sellerId);
        return userOn;
    };
    const handleOpenChatBox = (receiId, usename) => {
        setReceiverIdList((prev) =>
            prev.find((item) => item.receiId === receiId) ? prev : [...prev, { receiId, usename }],
        );
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };

    useEffect(() => {
        if (accessToken) {
            fetchAproveldCars();
            socket = connectSocket();
            socket.on('users_online', (data) => {
                setUserOnline(data);
            });
        }
        return () => {
            if (socket) {
                socket.off('users_online');
            }
        };
    }, [changeCar, accessToken]);

    const offset = currentPage * itemsPerPage;
    const currentItems = carList.slice(offset, offset + itemsPerPage);

    return (
        <div className={cx('pending-products')}>
            <h2>Bảng tin</h2>

            {carList.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <>
                    <ul className={cx('product-list')}>
                        {currentItems.map((car, index) => (
                            <li key={index}>
                                <div className={cx('images')}>
                                    <span className={cx('img-quantity')}> </span>
                                    <img src={car.images[0]} alt={car.title} />
                                </div>
                                <div className={cx('body')}>
                                    <div className={cx('information')}>
                                        <h3 className={cx('title')}>{car.title}</h3>
                                        <p className={cx('price')}>
                                            <strong>Giá:</strong> {handlePrice(car.price)} VND
                                        </p>
                                        <p>
                                            <strong>Địa chỉ người bán:</strong> {car.address}
                                        </p>

                                        <p>
                                            <strong>Mô tả:</strong> {car.description}
                                        </p>
                                        <p>
                                            <strong>người bán:</strong> {car.sellerName}
                                        </p>
                                        <p>
                                            <strong>Ngày đăng:</strong> {new Date(car.createdAt).toLocaleString()}
                                        </p>
                                        <div className={cx('actions')}>
                                            {cartIdList.includes(car._id) ? (
                                                <p>đã thêm vào giỏ hàng</p>
                                            ) : (
                                                <div
                                                    className={cx('cart')}
                                                    onClick={() => {
                                                        handAddToCart(car._id);
                                                        setChangeCar(car._id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCartShopping} />
                                                </div>
                                            )}

                                            <div className={cx('chat')}>
                                                <FontAwesomeIcon
                                                    onClick={() => {
                                                        handleOpenChatBox(car.sellerId, car.sellerName);
                                                    }}
                                                    icon={faMessage}
                                                />
                                                {handleUserOnline(usersOnline, car.sellerId) ? (
                                                    <p>người bán đang on</p>
                                                ) : (
                                                    'đã off'
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={cx('listChatBox')}>
                        {receiverIdList.map((item) => {
                            return (
                                <ChatBox
                                    key={item.receiId}
                                    receiverId={item.receiId}
                                    username={item.usename}
                                    closeChatBox={closeChatBox}
                                />
                            );
                        })}
                    </div>

                    {/* Phân trang */}
                    <ReactPaginate
                        previousLabel={'«'}
                        nextLabel={'»'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(carList.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageChange}
                        containerClassName={cx('pagination')}
                        activeClassName={'active'}
                    />
                    <ToastContainer position="top-right" autoClose={3000} />
                </>
            )}
        </div>
    );
};

export default ApprovaledCars;
