import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import api from '~/api/api';
import styles from './OwnPost.module.scss';
import { faImages, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Button from '~/components/Button';

import Slide from '~/components/Slider/slide';
const cx = classNames.bind(styles);

const OwnPost = () => {
    const [carList, setCarList] = useState([]);
    const [changeCar, setChangeCar] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [images, setImages] = useState([]); // to slide image
    const [displaySlide, setDisplaySlide] = useState(false); // to displayslide
    const accessToken = useSelector((state) => state.auth.accessToken);
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang

    const fetchPosts = async () => {
        try {
            const response = await api.get('/user/get-user-own-posts');
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
    const confirmIsSold = (id) => {
        let result = window.confirm('Bạn đã bán nó');
        if (result) {
            console.log(id);
        }
    };
    const deletePost = async (id) => {
        let result = window.confirm('Bạn muốn xóa tin này');
        if (result) {
            try {
                await api.post('user/delete-post', { carId: id });
                setChangeCar(true);
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {
        if (accessToken) {
            fetchPosts();
        }
    }, [changeCar, accessToken]);

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

                                <div className={cx('information')}>
                                    <h4 className={cx('title')}>{car.title}</h4>
                                    <p className={cx('price')}>
                                        <strong>Giá:</strong> {car.price.toLocaleString('de-DE')} VND
                                    </p>
                                    <p>
                                        <strong>Địa chỉ người bán:</strong> {car.address}
                                    </p>

                                    <p>
                                        <strong>Mô tả:</strong> {car.description}
                                    </p>
                                    <p>
                                        <strong>Trạng thái:</strong> {car.status}
                                    </p>
                                    <p>
                                        <strong>Ngày đăng:</strong> {new Date(car.createdAt).toLocaleString()}
                                    </p>

                                    <div className={cx('actions', 'row')}>
                                        <div
                                            onClick={() => {
                                                deletePost(car._id);
                                            }}
                                            className={cx('delete')}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
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
