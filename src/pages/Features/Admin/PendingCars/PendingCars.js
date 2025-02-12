import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import api from '~/api/api';
import styles from './PendingCars.module.scss';
import Button from '~/components/Button';
const cx = classNames.bind(styles);
const PendingProducts = () => {
    const [carList, setCarList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang

    useEffect(() => {
        const fetchPendingCars = async () => {
            try {
                const response = await api.get('/admin/get-PendingCars');
                setCarList(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPendingCars();
    }, []);

    // Lấy danh sách xe theo trang hiện tại
    const offset = currentPage * itemsPerPage;
    const currentItems = carList.slice(offset, offset + itemsPerPage);

    const handlePageChange = (event) => {
        setCurrentPage(event.selected);
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
                                    <p>
                                        <strong>Địa chỉ người bán:</strong> {car.address}
                                    </p>
                                    <p>
                                        <strong>Giá:</strong> {car.price} VND
                                    </p>
                                    <p>
                                        <strong>Mô tả:</strong> {car.description}
                                    </p>
                                    <p>
                                        <strong>Ngày đăng:</strong> {new Date(car.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className={cx('images')}>
                                    <img src={car.images[0]} alt={car.title} width="200" />
                                </div>
                                <div className={cx('btn-accept-reject')}>
                                    <Button primary>Duyệt</Button>
                                    <Button outline>Từ chối</Button>
                                </div>
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
