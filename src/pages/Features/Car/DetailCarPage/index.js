import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { getCarApi, getCarDetailForAdminApi } from '~/api/car';
import { getUserApi } from '~/api/user';
import { addToCartApi } from '~/api/cart';
import styles from './detailCar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMessage,
    faImages,
    faCartShopping,
    faPhone,
    faEnvelope,
    faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { connectSocket } from '~/utils/socket';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Slide from '~/components/Slider/slide';
import ChatBox from '~/components/ChatBox/ChatBox';
import { useNavigate } from 'react-router-dom';
import TomTomMap from '~/components/Map';
const cx = classNames.bind(styles);
const DetailCar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [images, setImages] = useState([]); // to slide image
    const [displaySlide, setDisplaySlide] = useState(false); // to displayslide
    const [carDetail, setCarDetail] = useState({});
    const [seller, setSeller] = useState({});
    const [loading, setLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.user?.role) ;
    let socket;
    const [receiverIdList, setReceiverIdList] = useState([]); //it was made to render list chatbox
    const handleOpenChatBox = (receiId, username) => {
        if (isLoggedIn) {
            setReceiverIdList((prev) =>
                prev.some((item) => item.receiId === receiId) ? prev : [...prev, { receiId, username }],
            );
        } else {
            navigate('/login');
        }
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };
    const handlePrice = (number) => {
        const formattedPrice = number.toLocaleString('de-DE');
        return formattedPrice;
    };
    const handAddToCart = async (carId) => {
        if (isLoggedIn) {
            try {
                await addToCartApi(carId);
                toast.success('thêm vào giỏ hàng thành công');
            } catch (error) {
                console.log(error);
                toast.error('thêm vào giỏ hàng thất bại');
            }
        } else {
            navigate('/login');
        }
    };
    const getDetailCar = async () => {
        try {
            let rsp;
            if (role === 'admin') {
                rsp = await getCarDetailForAdminApi(`_id=${id}`);
            } else {
                rsp = await getCarApi(`_id=${id}`);
            }
            const rsp2 = await getUserApi(`_id=${rsp.data.data[0].sellerId}`);
            setCarDetail(rsp.data.data[0]);
            setSeller(rsp2.data.data[0]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleOpenImages = (images) => {
        setImages(images);
        setDisplaySlide(true);
    };

    const handleCloseImages = () => {
        setImages([]);
        setDisplaySlide(false);
    };
    useEffect(() => {
        getDetailCar();
        socket = connectSocket();
        socket.on('receive_message', (data) => {
            const { senderId, username } = data;
            handleOpenChatBox(senderId, username);
        });
        return () => {
            if (socket) {
                socket.off('users_online');
            }
        };
    }, []);
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }
    return (
        <>
            <div className={cx('wraper')}>
                <div className={cx('row-nowrap')}>
                    <div className="col-full">
                        <div
                            className={cx('images', 'boder_custom')}
                            onClick={() => {
                                handleOpenImages(carDetail.images);
                            }}
                        >
                            <span className={cx('img-quantity')}>
                                {' '}
                                <FontAwesomeIcon icon={faImages} />
                            </span>
                           
                            <img src={carDetail.images[0]} alt={carDetail.title} />
                        </div>
                        <div className={cx('title_price', 'boder_custom')}>
                            <h3 className={cx('title')}>{carDetail.title}</h3>

                            <p className={cx('price')}>{handlePrice(carDetail.price)} Đ</p>
                            {role === 'admin' ? (
                                ''
                            ) : (
                                <div className={cx('action', 'row-nowrap')}>
                                    <p
                                        onClick={() => {
                                            handAddToCart(carDetail._id);
                                        }}
                                        title="Thêm vào giỏ hàng"
                                    >
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </p>
                                    <p>
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                handleOpenChatBox(carDetail.sellerId, carDetail.sellerName);
                                            }}
                                            title="chat với người bán"
                                            icon={faMessage}
                                        />
                                    </p>
                                </div>
                            )}

                            <p className={cx('date')}>
                                <strong>Ngày đăng</strong>{' '}
                                {new Date(carDetail.createdAt).toLocaleDateString('vi-VN', {
                                    month: 'long',
                                    year: 'numeric',
                                })}{' '}
                            </p>
                        </div>
                        <div className={cx('describe', 'boder_custom', 'flex-column')}>
                            <h3>Miêu tả</h3>
                            <div className="row-nowrap">
                                <p>{carDetail.description}</p>
                            </div>
                        </div>
                        <div className={cx('information', 'boder_custom', 'flex-column')}>
                            <h3>Thông tin cơ bản</h3>
                            <div className="row-nowrap">
                                <p>
                                    <strong>Hãng xe:</strong> {carDetail.brand}
                                </p>
                                <p>
                                    <strong>Số vạn:</strong> {carDetail.mileage} Km
                                </p>
                            </div>
                            <div className="row-nowrap">
                                <p>
                                    <strong>Tình trạng:</strong> {carDetail.condition}
                                </p>
                                <p>
                                    <strong>Miêu tả:</strong> {carDetail.description}
                                </p>
                                <p>
                                    <strong>năm sản xuất:</strong> {carDetail.year}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className={cx('seller', 'boder_custom')}>
                            <div className={cx('resume', 'flex-column')}>
                                <div className={cx('col', 'seller-img')}>
                                    <img src="\images\unknows_person.jpg"></img>
                                    <h3>
                                        {carDetail.sellerName}
                                        &nbsp;
                                    </h3>
                                </div>

                                <div className="col">
                                    <div className={cx('seller-infor')}>
                                        <p>
                                            <FontAwesomeIcon icon={faPhone} /> &nbsp;{seller.phone}
                                        </p>

                                        <p>
                                            <FontAwesomeIcon icon={faEnvelope} /> &nbsp;{seller.email}
                                        </p>
                                        <p>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                            &nbsp; {carDetail.address?.province?.name},
                                            {carDetail.address?.district?.name},{carDetail.address?.ward?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TomTomMap
                            // map
                            address={`${carDetail.address?.province?.name || ''} ${
                                carDetail.address?.district?.name || ''
                            } ${carDetail.address?.ward?.name || ''}`}
                        />
                    </div>
                </div>
                {displaySlide ? <Slide images={images} closeSlide={handleCloseImages} /> : ''}
                <ToastContainer position="top-right" autoClose={3000} />
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
            </div>
        </>
    );
};
export default DetailCar;
