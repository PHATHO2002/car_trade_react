 import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { getCartApi, removeFromCartApi } from '~/api/cart';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faInfo } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const Cart = () => {
    const [carList, setCarList] = useState([]);

    const fetchPendingCars = async () => {
        try {
            const response = await getCartApi();
            console.log(response)
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
            await removeFromCartApi(carId);
            fetchPendingCars();
            toast.success('xóa đơn hàng thành công!');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchPendingCars();
    }, []);

    return (
        <div className={cx('wraper')}>
            <h3>Giỏ Hàng</h3>
            {carList.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <>
                    <ul className={cx('product-list', 'flex-column')}>
                        {carList.map((car, index) => (
                            <Link to={`/car/${car._id}`}>
                                <li className="row-nowrap" key={index}>
                                    <div className="col">
                                        <div className={cx('images')}>
                                            <img src={car.images[0]} alt={car.title} width="200" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className={cx('body')}>
                                            <div className={cx('information', 'flex-column')}>
                                                <h3 className={cx('title')}>{car.title}</h3>
                                                <p className={cx('price')}>
                                                    <strong>Giá:</strong> {handlePrice(car.price)} VND
                                                </p>
                                            </div>
                                            <div className={cx('actions', 'row')}>
                                                <p
                                                    className={cx('trash')}
                                                    onClick={() => {
                                                        handleDeleteItem(car._id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Cart;
