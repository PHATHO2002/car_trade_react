import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './PendingCars.module.scss';
import Button from '~/components/Button';
import { connectSocket } from '~/utils/socket';
import { getCarPendingApi, updateCarStatusApi } from '~/api/car';
const cx = classNames.bind(styles);

const PendingProducts = () => {
    const [carList, setCarList] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang
    let socket;
    const fetchPendingCars = async () => {
        try {
            const response = await getCarPendingApi();
            setCarList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchPendingCars();
        socket = connectSocket();
        if (socket) {
            socket.on('pendingCarNotification', (data) => {
                setCarList((prevCarList) => [...prevCarList, data.carData]);
            });
        }

        return () => {
            if (socket) {
                socket.off('pendingCarNotification');
            }
        };
    }, [changeCar]);

    // Lấy danh sách xe theo trang hiện tại
    const offset = currentPage * itemsPerPage;
    const currentItems = carList.slice(offset, offset + itemsPerPage);

    const handlePageChange = (event) => {
        setCurrentPage(event.selected);
    };
    const approvalCar = async (id) => {
        try {
            setLoading(true);
            const response = await updateCarStatusApi(id, 'accepted');

            setChangeCar(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const rejectedCar = async (id) => {
        try {
            const response = await updateCarStatusApi(id, 'rejected');
            setChangeCar(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={cx('pending-products')}>
            <h2>Sản phẩm Chờ Duyệt</h2>
            {carList.length === 0 ? (
                <p>Không có sản phẩm nào cần duyệt.</p>
            ) : (
                <>
                    <ul className={cx('product-list')}>
                        {currentItems.map((car, index) => (
                            <li key={index}>
                                <div className={cx('title')}>
                                    <h3>{car.title}</h3>
                                </div>
                                <div className={cx('information')}>
                                    <p>{/* <strong>Địa chỉ người bán:</strong> {car.address} */}</p>
                                    <p>
                                        <strong>Giá:</strong> {car.price} VND
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
                                </div>

                                <div className={cx('images')}>
                                    <img src={car.images[0]} alt={car.title} width="200" />
                                </div>
                                {loading ? (
                                    <div className={cx('btn-accept-reject')}>
                                        <Button primary>loading</Button>
                                        <Button outline>loading</Button>
                                    </div>
                                ) : (
                                    <div className={cx('btn-accept-reject')}>
                                        <Button primary onClick={() => approvalCar(car._id)}>
                                            Duyệt
                                        </Button>
                                        <Button outline onClick={() => rejectedCar(car._id)}>
                                            Từ chối
                                        </Button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

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
                </>
            )}
        </div>
    );
};

export default PendingProducts;
