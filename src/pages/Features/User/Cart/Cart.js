import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import api from '~/api/api';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faInfo } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);
const Cart = () => {
    const [carList, setCarList] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const fetchPendingCars = async () => {
        try {
            const response = await api.post('/user/get-cart');
            setCarList(response.data.data.carIds);
        } catch (error) {
            console.log(error);
        }
    };
    const handlePrice = (number) => {
        const formattedPrice = number.toLocaleString('de-DE');
        return formattedPrice;
    };
    const handleDeleteItem = async (carId) => {
        try {
            await api.post('/user/delete-item-in-cart', { carId });
            fetchPendingCars();
            toast.success('xóa đơn hàng thành công!');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (accessToken) {
            fetchPendingCars();
        }
    }, [changeCar, accessToken]);

    return (
        <div className={cx('pending-products')}>
            <h2>Giỏ Hàng</h2>
            {carList.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <>
                    <ul className={cx('product-list')}>
                        {carList.map((car, index) => (
                            <li key={index}>
                                <div className={cx('images')}>
                                    <img src={car.images[0]} alt={car.title} width="200" />
                                </div>
                                <div className={cx('body')}>
                                    <div className={cx('information')}>
                                        <h3 className={cx('title')}>{car.title}</h3>
                                        <p className={cx('price')}>
                                            <strong>Giá:</strong> {handlePrice(car.price)} VND
                                        </p>
                                    </div>
                                    <div className={cx('actions')}>
                                        <p
                                            className={cx('trash')}
                                            onClick={() => {
                                                handleDeleteItem(car._id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </p>
                                        <p className={cx('faInfo')}>
                                            <FontAwesomeIcon icon={faInfo} />
                                            chi tiết
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Cart;
