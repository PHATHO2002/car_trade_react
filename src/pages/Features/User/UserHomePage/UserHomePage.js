import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import api from '~/api/api';
import axios from 'axios';
import styles from './UserHomePage.module.scss';
import {
    faCartShopping,
    faL,
    faMessage,
    faCircleCheck,
    faCircleXmark,
    faImages,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { connectSocket } from '~/utils/socket';
import ChatBox from '~/components/ChatBox/ChatBox';
import Slide from '~/components/Slider/slide';
import NotFound from '~/components/notFound';
const cx = classNames.bind(styles);

const UserHomePage = () => {
    const [carList, setCarList] = useState([]);
    const [cartIdList, setcartsId] = useState([]);
    const [usersOnline, setUserOnline] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [receiverIdList, setReceiverIdList] = useState([]); //it was made to render list chatbox
    const [images, setImages] = useState([]); // to slide image
    const [displaySlide, setDisplaySlide] = useState(false); // to displayslide
    const user = useSelector((state) => state.auth.user);

    // state lọc theo adress
    const [currentListAdress, setCurrentListAdress] = useState([]); //list province or quận huyện or xã
    const [currentDivisonType, setCurrentDivisonType] = useState('Tỉnh/Thành phố');
    const [showAllAdress, setShowAllAdress] = useState(false); // see more or Hide address
    const [errFilter, setErrFilter] = useState(false); // hiện thị không tìm kiếm thấy
    const [currentProvice, setCurrentProvice] = useState({});
    const [currentDistrict, setCurrentDistrict] = useState({});
    const visibleAdress = showAllAdress ? currentListAdress : currentListAdress.slice(0, 5);
    let socket;
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang

    const fetchAproveldCars = async () => {
        try {
            const response = await api.get('/car?status=accepted');
            const response2 = await api.get('/cart');
            setCarList(response.data.data);
            let cartIds = response2.data.data.carIds.map((item) => item._id);
            setcartsId(cartIds);
        } catch (error) {
            console.log(error);
        }
    };

    const handAddToCart = async (carId) => {
        try {
            await api.post('/cart', { carId: carId });
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
    const handleOpenChatBox = (receiId, username) => {
        setReceiverIdList((prev) =>
            prev.some((item) => item.receiId === receiId) ? prev : [...prev, { receiId, username }],
        );
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };
    const handleOpenImages = (images) => {
        setImages(images);
        setDisplaySlide(true);
    };
    const handleCloseImages = () => {
        setImages([]);
        setDisplaySlide(false);
    };

    // fun handle filter address
    const getProvincesVn = async () => {
        try {
            const provincesRsp = await axios.get('https://provinces.open-api.vn/api/p');
            setCurrentListAdress(provincesRsp.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const handleChaneDivision = async (currentAdress) => {
        try {
            if (currentAdress?.code && currentAdress?.division_type == 'tỉnh') {
                setCurrentProvice({
                    code: currentAdress.code,
                    name: currentAdress.name,
                    division_type: currentAdress.division_type,
                });
                const provincesAndistricts = await axios.get(
                    `https://provinces.open-api.vn/api/p/${currentAdress.code}?depth=2`, //includes huyện và xã
                );
                let filterCarList = carList.filter((car) => {
                    // lọc theo province
                    return car.address.province.code == currentAdress.code;
                });
                if (filterCarList.length < 1) {
                    setErrFilter(true);
                }
                setCarList(filterCarList);
                setCurrentListAdress(provincesAndistricts.data.districts);
                setCurrentDivisonType('Huyện/Quận');
            } else if (currentAdress?.code && currentAdress?.division_type == 'huyện') {
                setCurrentDistrict({
                    code: currentAdress.code,
                    name: currentAdress.name,
                    division_type: currentAdress.division_type,
                });
                let filterCarList = carList.filter((car) => {
                    // lọc theo disctrict
                    return car.address.district.code == currentAdress.code;
                });
                if (filterCarList.length < 1) {
                    setErrFilter(true);
                }
                setCarList(filterCarList);
            } else {
                setCurrentProvice({});
                setCurrentDistrict({});
                setCurrentDivisonType('Tỉnh/Thành phố');
                getProvincesVn();
                fetchAproveldCars();
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    useEffect(() => {
        fetchAproveldCars();
        socket = connectSocket();
        socket.on('users_online', (data) => {
            setUserOnline(data);
        });
        socket.on('receive_message', (data) => {
            const { senderId, username } = data;
            handleOpenChatBox(senderId, username);
        }); //automatically generated chat box when a message arrives

        return () => {
            if (socket) {
                socket.off('users_online');
            }
        };
    }, [changeCar]);

    useEffect(() => {
        getProvincesVn();
    }, []);
    const offset = currentPage * itemsPerPage;
    const currentItems = carList.slice(offset, offset + itemsPerPage);
    let newCurrentItems = [];
    newCurrentItems = currentItems.filter((item) => {
        return !(item.sellerId === user?.userId);
    });
    return (
        <div className={cx('wraper')}>
            <>
                <div className={cx('filter-header')}>
                    <ul className={cx('row-nowrap')}>
                        {currentProvice.name && (
                            <>
                                <li onClick={() => handleChaneDivision()}>
                                    <strong>Khu vực </strong>
                                </li>
                                <li>{currentProvice.name}</li>
                            </>
                        )}
                        {currentDistrict.name && <li>{currentDistrict.name}</li>}
                    </ul>
                </div>
                <div className={cx('content', 'row-nowrap')}>
                    {newCurrentItems.length === 0 ? (
                        errFilter ? (
                            <div className="col">
                                <NotFound
                                    title={'Không tìm thấy kết quả tìm kiếm'}
                                    describe={'Vui long lọc theo trường khác'}
                                />
                            </div>
                        ) : (
                            <div className="col">
                                <NotFound title={'Không có xe'} describe={'Hiện tại không có người đăng bán xe'} />
                            </div>
                        )
                    ) : (
                        <ul className={cx('product-list', 'col', 'flex-column')}>
                            {newCurrentItems.map((car, index) => (
                                <li className={cx('row-nowrap')} key={index}>
                                    <div className="col">
                                        <div
                                            className={cx('images')}
                                            onClick={() => {
                                                handleOpenImages(car.images);
                                            }}
                                        >
                                            <span className={cx('img-quantity')}>
                                                {' '}
                                                <FontAwesomeIcon icon={faImages} />
                                            </span>
                                            <img src={car.images[0]} alt={car.title} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        {' '}
                                        <div className={cx('information', 'flex-column')}>
                                            <h3 className={cx('title')}>{car.title}</h3>
                                            <p className={cx('price')}>
                                                <strong>Giá:</strong> {handlePrice(car.price)} VND
                                            </p>
                                            <p>
                                                <strong>Hãng xe:</strong> {car.brand}
                                            </p>
                                            <p>
                                                <strong>năm sản xuất:</strong> {car.year}
                                            </p>

                                            <p>
                                                <strong>Địa chỉ người bán:</strong> {car.address?.province?.name},
                                                {car.address?.district?.name},{car.address?.ward?.name}
                                            </p>
                                            <p>
                                                <strong>Ngày đăng:</strong> {new Date(car.createdAt).toLocaleString()}
                                            </p>
                                            {handleUserOnline(usersOnline, car.sellerId) ? (
                                                <p className={cx('online')}>
                                                    <FontAwesomeIcon icon={faCircleCheck} /> người bán online
                                                </p>
                                            ) : (
                                                <p className={cx('offline')}>
                                                    <FontAwesomeIcon icon={faCircleXmark} /> người bán offline
                                                </p>
                                            )}
                                            <div className={cx('actions', 'row')}>
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
                                                    <p>
                                                        {' '}
                                                        <FontAwesomeIcon
                                                            onClick={() => {
                                                                handleOpenChatBox(car.sellerId, car.sellerName);
                                                            }}
                                                            icon={faMessage}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <ul className={cx('address-filter')}>
                        <h1>{currentDivisonType}</h1>
                        {visibleAdress.map((p, index) => (
                            <li
                                onClick={() => {
                                    handleChaneDivision(p);
                                }}
                                key={index}
                            >
                                {p.name}
                            </li>
                        ))}
                    </ul>
                    {currentListAdress.length > 5 && (
                        <button onClick={() => setShowAllAdress(!showAllAdress)}>
                            {showAllAdress ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    )}
                </div>

                <div className={cx('listChatBox', 'row-nowrap')}>
                    {receiverIdList.slice(-2).map((item) => (
                        <ChatBox
                            key={item.receiId}
                            receiverId={item.receiId}
                            username={item.username}
                            closeChatBox={closeChatBox}
                        />
                    ))}
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
                {displaySlide ? <Slide images={images} closeSlide={handleCloseImages} /> : ''}
                <ToastContainer position="top-right" autoClose={3000} />
            </>
        </div>
    );
};

export default UserHomePage;
