import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import api from '~/api/api';
import styles from './detailCar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faImages, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { connectSocket } from '~/utils/socket';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Slide from '~/components/Slider/slide';
import ChatBox from '~/components/ChatBox/ChatBox';
const cx = classNames.bind(styles);
const DetailCar = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]); // to slide image
    const [displaySlide, setDisplaySlide] = useState(false); // to displayslide
    const [carDetail, setCarDetail] = useState({});
    const [loading, setLoading] = useState(true);
    let socket;
    const [receiverIdList, setReceiverIdList] = useState([]); //it was made to render list chatbox
    const handleOpenChatBox = (receiId, username) => {
        setReceiverIdList((prev) =>
            prev.some((item) => item.receiId === receiId) ? prev : [...prev, { receiId, username }],
        );
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };
    const handlePrice = (number) => {
        const formattedPrice = number.toLocaleString('de-DE');
        return formattedPrice;
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
    const getDetailCar = async () => {
        try {
            const rsp = await api.get(`/car?_id=${id}`);

            setCarDetail(rsp.data.data[0]);
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
                    <div className="col">
                        <div
                            className={cx('images')}
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
                    </div>
                    <div className="col">
                        {' '}
                        <div className={cx('information', 'flex-column')}>
                            <h3 className={cx('title')}>{carDetail.title}</h3>

                            <p className={cx('price')}>
                                {console.log(carDetail.price)}
                                <strong>Giá:</strong> {handlePrice(carDetail.price)} VND
                            </p>
                            <p>
                                <strong>Hãng xe:</strong> {carDetail.brand}
                            </p>
                            <p>
                                <strong>năm sản xuất:</strong> {carDetail.year}
                            </p>

                            <p>
                                <strong>Địa chỉ người bán:</strong> {carDetail.address?.province?.name},
                                {carDetail.address?.district?.name},
                            </p>
                            <div
                                className={cx('cart')}
                                onClick={() => {
                                    handAddToCart(carDetail._id);
                                }}
                            >
                                <FontAwesomeIcon icon={faCartShopping} />
                            </div>
                            <div className={cx('chat')}>
                                <p>
                                    {' '}
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            handleOpenChatBox(carDetail.sellerId, carDetail.sellerName);
                                        }}
                                        icon={faMessage}
                                    />
                                </p>
                            </div>
                        </div>
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
