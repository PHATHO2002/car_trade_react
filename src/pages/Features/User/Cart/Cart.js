import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import api from '~/api/api';
import styles from './Cart.module.scss';

const cx = classNames.bind(styles);
const Cart = () => {
    const [carList, setCarList] = useState([]);
    const [changeCar, setChangeCar] = useState(null);

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
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPendingCars();
        }, 500);

        return () => clearTimeout(timeout);
    }, [changeCar]);

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
                                <div className={cx('information')}>
                                    <h3 className={cx('title')}>{car.title}</h3>
                                    <p className={cx('price')}>
                                        <strong>Giá:</strong> {handlePrice(car.price)} VND
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Cart;
