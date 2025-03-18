import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import api from '~/api/api';
import axios from 'axios';
import styles from './UserHomePage.module.scss';
import {
    faCartShopping,
    faMessage,
    faCircleCheck,
    faCircleXmark,
    faImages,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { connectSocket } from '~/utils/socket';
import NotFound from '~/components/notFound';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

const UserHomePage = () => {
    const [carList, setCarList] = useState([]);
    const [cartIdList, setcartsId] = useState([]);
    const [usersOnline, setUserOnline] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const user = useSelector((state) => state.auth.user);
    //state lọc theo hãng
    const [brands, setBrands] = useState([]);
    const [currentBrand, setCurrentBrand] = useState('');
    const [showAllBrands, setShowAllBrands] = useState(false); // see more or Hide address
    // state lọc theo adress
    const [currentListAdress, setCurrentListAdress] = useState([]); //list province or quận huyện or xã
    const [currentAdress, setCurrentAdress] = useState(''); // check if filter address exits;
    const [currentDivisonType, setCurrentDivisonType] = useState('Tỉnh/Thành phố');
    const [showAllAdress, setShowAllAdress] = useState(false); // see more or Hide address
    const [errFilter, setErrFilter] = useState(false); // hiện thị không tìm kiếm thấy
    const [currentProvice, setCurrentProvice] = useState({});
    const [currentDistrict, setCurrentDistrict] = useState({});
    const visibleAdress = showAllAdress ? currentListAdress : currentListAdress.slice(0, 5);
    const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);
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

    // fun get getProvincesVn
    const getProvincesVn = async () => {
        try {
            const provincesRsp = await axios.get('https://provinces.open-api.vn/api/p');
            setCurrentListAdress(provincesRsp.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const getCarBrands = async () => {
        try {
            const brands = await api.get('/car/brands');
            setBrands(brands.data.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const handleFilter = async (currentAdress = null, currentBrand = null, closeCurrentFilter = null) => {
        try {
            if (currentAdress && !currentBrand) {
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
                }
            }
            if (!currentAdress && currentBrand) {
                await fetchAproveldCars();
                setCarList((prev) => prev.filter((car) => car.brand == currentBrand));
            }
            if (currentAdress && currentBrand) {
                await fetchAproveldCars();
                if (currentAdress.division_type == 'tỉnh') {
                    setCurrentProvice({
                        code: currentAdress.code,
                        name: currentAdress.name,
                        division_type: currentAdress.division_type,
                    });
                    setCarList((prev) =>
                        prev.filter(
                            (car) => car.brand == currentBrand && car.address?.province.code == currentAdress.code,
                        ),
                    );
                } else {
                    setCurrentDistrict({
                        code: currentAdress.code,
                        name: currentAdress.name,
                        division_type: currentAdress.division_type,
                    });
                    setCarList((prev) =>
                        prev.filter(
                            (car) => car.brand == currentBrand && car.address?.district.code == currentAdress.code,
                        ),
                    );
                }
            }
            if (closeCurrentFilter == 'address') {
                setCurrentProvice({});
                setCurrentAdress('');
                setCurrentDistrict({});
                setCurrentDivisonType('Tỉnh/Thành phố');
                getProvincesVn();
                fetchAproveldCars();
            }
            if (closeCurrentFilter == 'brand') {
                setCurrentBrand('');

                fetchAproveldCars();
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    useEffect(() => {
        fetchAproveldCars();
        getProvincesVn();
        getCarBrands();
        socket = connectSocket();
        socket.on('users_online', (data) => {
            setUserOnline(data);
        });

        return () => {
            if (socket) {
                socket.off('users_online');
            }
        };
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
                                <li onClick={() => handleFilter(null, null, 'address')}>
                                    <strong>Khu vực </strong>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                    &nbsp;
                                    {currentProvice.name}
                                </li>
                            </>
                        )}
                        {currentDistrict.name && (
                            <li>
                                <FontAwesomeIcon icon={faArrowRight} />
                                &nbsp; {currentDistrict.name}
                            </li>
                        )}
                    </ul>
                    <ul className={cx('row-nowrap')}>
                        {currentBrand ? (
                            <>
                                <li onClick={() => handleFilter(null, null, 'brand')}>
                                    <strong>Hãng </strong>
                                </li>
                                <li>
                                    {' '}
                                    <FontAwesomeIcon icon={faArrowRight} />
                                    &nbsp; {currentBrand}
                                </li>
                            </>
                        ) : (
                            ''
                        )}
                    </ul>
                </div>
                <div className={cx('content', 'row-nowrap')}>
                    {newCurrentItems.length === 0 ? (
                        errFilter ? (
                            <div className="col">
                                <NotFound
                                    title={`Không tìm thấy `}
                                    describe={`Không tìm thấy kết quả cho  ${currentAdress.name} ${currentBrand}`}
                                />
                            </div>
                        ) : (
                            <div className="col">
                                <NotFound title={'Không có xe'} describe={'Hiện tại không có người đăng bán xe'} />
                            </div>
                        )
                    ) : (
                        <ul className={cx('product-list', 'col-full', 'flex-column')}>
                            {newCurrentItems.map((car, index) => (
                                <Link to={`/car/${car._id}`}>
                                    <li className={cx('row-nowrap')} key={index}>
                                        <div className="col">
                                            <div className={cx('images')}>
                                                <img src={car.images[0]} alt={car.title} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            {' '}
                                            <div className={cx('information', 'flex-column')}>
                                                <Link to={`/car/${car._id}`}>
                                                    <h3 className={cx('title')}>{car.title}</h3>
                                                </Link>
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
                                                    {car.address?.district?.name},
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
                                                        <p>
                                                            <div className={cx('cart')}>
                                                                <FontAwesomeIcon icon={faCartShopping} />
                                                            </div>
                                                        </p>
                                                    )}

                                                    <div className={cx('chat')}>
                                                        <p>
                                                            {' '}
                                                            <FontAwesomeIcon icon={faMessage} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    )}
                    <div className={cx('filter', 'col-3', 'flex-column')}>
                        <ul className={cx('address-filter')}>
                            <h3>{currentDivisonType}</h3>
                            {visibleAdress.map((p, index) => (
                                <li
                                    onClick={() => {
                                        if (currentBrand) {
                                            // if exist current brand will filter both of them
                                            handleFilter(p, currentBrand);
                                            setCurrentAdress(p);
                                        } else {
                                            handleFilter(p);

                                            setCurrentAdress(p);
                                        }
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
                        <ul className={cx('brand-filter')}>
                            <h3>Hãng</h3>
                            {visibleBrands.map((b, index) => (
                                <li
                                    onClick={() => {
                                        if (currentAdress) {
                                            // xử lý nếu có address thì lọc cả address
                                            handleFilter(currentAdress, b.name);
                                            setCurrentBrand(b.name);
                                        } else {
                                            handleFilter(null, b.name);
                                            setCurrentBrand(b.name);
                                        }
                                    }}
                                    key={index}
                                >
                                    {b.name}
                                </li>
                            ))}
                        </ul>
                        {brands.length > 5 && (
                            <button onClick={() => setShowAllBrands(!showAllBrands)}>
                                {showAllBrands ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </div>
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

                <ToastContainer position="top-right" autoClose={3000} />
            </>
        </div>
    );
};

export default UserHomePage;
