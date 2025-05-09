import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getCarApi, deleteCarApi, updateSaleStatusApi } from '~/api/car';
import styles from './OwnPost.module.scss';
import { faImages, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';

import Slide from '~/components/Slider/slide';
const cx = classNames.bind(styles);

const OwnPost = () => {
    const [carList, setCarList] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [images, setImages] = useState([]); // to slide image
    const [displaySlide, setDisplaySlide] = useState(false); // to displayslide
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang
    const user = useSelector((state) => state.auth.user);
    const fetchPosts = async () => {
        try {
            const response = await getCarApi(`sellerId=${user.userId}`);
            setCarList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handlePageChange = (event) => {
        setCurrentPage(event.selected);
    };

    const handleOpenImages = (images) => {
        setImages(images);
        setDisplaySlide(true);
    };
    const handleCloseImages = () => {
        setImages([]);
        setDisplaySlide(false);
    };
    const confirmIsSold = async (id) => {
        let result = window.confirm('Bạn đã bán nó');
        if (result) {
            try {
                await updateSaleStatusApi(id, { saleStatus: 'sold' });
                await fetchPosts();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const confirmIsReserved = async (id) => {
        let result = window.confirm('Đã có người cọc nó');
        if (result) {
            try {
                await updateSaleStatusApi(id, { saleStatus: 'reserved' });
                await fetchPosts();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const confirmRemoveReserved = async (id) => {
        let result = window.confirm('Tin này đã bị hủy cọc');
        if (result) {
            try {
                await updateSaleStatusApi(id, { saleStatus: 'available' });
                await fetchPosts();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const deletePost = async (id) => {
        let result = window.confirm('Bạn muốn xóa tin này');
        if (result) {
            try {
                await deleteCarApi(id);
                setChangeCar(true);
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {
        fetchPosts();
    }, [changeCar]);

    const offset = currentPage * itemsPerPage;
    const currentItems = carList.slice(offset, offset + itemsPerPage);

    return (
        <div className={cx('wraper')}>
            {carList.length === 0 ? (
                <h3>Bạn không post nào</h3>
            ) : (
                <>
                    <h3> Post của bạn</h3>
                    <ul className={cx('product-list', 'flex-column')}>
                        {currentItems.map((car, index) => (
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
                                    <div className={cx('information')}>
                                        <h4 className={cx('title')}>{car.title}</h4>
                                        <p className={cx('price')}>
                                            <strong>Giá:</strong> {car.price.toLocaleString('de-DE')} VND
                                        </p>
                                        <p>
                                            <strong>Địa chỉ người bán:</strong> {car.address?.province?.name},
                                            {car.address?.district?.name},{car.address?.ward?.name}
                                        </p>

                                        <p>
                                            <strong>Mô tả:</strong> {car.description}
                                        </p>
                                        <p>
                                            <strong>Trạng thái bán:</strong> {car.saleStatus}
                                        </p>
                                        <p>
                                            <strong>Trạng thái:</strong> {car.status}
                                        </p>
                                        <p>
                                            <strong>Ngày đăng:</strong> {new Date(car.createdAt).toLocaleString()}
                                        </p>

                                        <div className={cx('actions', 'row-nowrap')}>
                                            <div
                                                onClick={() => {
                                                    deletePost(car._id);
                                                }}
                                                className={cx('delete')}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </div>
                                            {car.saleStatus === 'reserved' ? (
                                                <>
                                                    <div className={cx('reserved')}>
                                                        <Button
                                                            onClick={() => {
                                                                confirmRemoveReserved(car._id);
                                                            }}
                                                            small
                                                            primary
                                                            children={'cọc đã bị hủy ?'}
                                                        />{' '}
                                                    </div>
                                                    <div className={cx('sold')}>
                                                        <Button
                                                            onClick={() => {
                                                                confirmIsSold(car._id);
                                                            }}
                                                            small
                                                            primary
                                                            children={'đã bán ?'}
                                                        />{' '}
                                                    </div>
                                                </>
                                            ) : car.saleStatus === 'sold' ? (
                                                ''
                                            ) : (
                                                <>
                                                    <div className={cx('reserved')}>
                                                        <Button
                                                            onClick={() => {
                                                                confirmIsReserved(car._id);
                                                            }}
                                                            small
                                                            primary
                                                            children={'đã cọc ?'}
                                                        />{' '}
                                                    </div>
                                                    <div className={cx('sold')}>
                                                        <Button
                                                            onClick={() => {
                                                                confirmIsSold(car._id);
                                                            }}
                                                            small
                                                            primary
                                                            children={'đã bán ?'}
                                                        />{' '}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
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
                    {displaySlide ? <Slide images={images} closeSlide={handleCloseImages} /> : ''}
                    <ToastContainer position="top-right" autoClose={3000} />
                </>
            )}
        </div>
    );
};

export default OwnPost;
