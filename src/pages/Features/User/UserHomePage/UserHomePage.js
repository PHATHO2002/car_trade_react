import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './UserHomePage.module.scss';
import { getCarApi, getCarBrandsApi } from '~/api/car';
import { getCartApi } from '~/api/cart';
import { getProvincesApi, getProvinceWithDistrictsApi } from '~/api/address';
import {
    faCartShopping,
    faMessage,
    faCircleCheck,
    faCircleXmark,
    faFilter,
    faArrowRight,
    faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { connectSocket } from '~/utils/socket';
import Button from '~/components/Button';
import NotFound from '~/components/notFound';
import { Link } from 'react-router-dom';
import Search from '~/components/Search/search';
const cx = classNames.bind(styles);

const UserHomePage = () => {
    const [carList, setCarList] = useState([]); // use for display
    const [carListStatic, setCarListStatic] = useState([]); // dung để filter
    const [cartIdList, setcartsId] = useState([]);
    const [usersOnline, setUserOnline] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const user = useSelector((state) => state.auth.user);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    //state lọc theo hãng
    const [brands, setBrands] = useState([]);
    const [currentBrand, setCurrentBrand] = useState('');
    const [showAllBrands, setShowAllBrands] = useState(false); // see more or Hide address
    const [showFilter, setShowFilter] = useState(false); // for responsive
    const toggleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };
    // state lọc theo adress
    const [currentListAdress, setCurrentListAdress] = useState([]); //list province or quận huyện or xã
    const [currentAdress, setCurrentAdress] = useState({ province: null, district: null }); // check if filter address exits;
    const [currentDivisonType, setCurrentDivisonType] = useState('Tỉnh/Thành phố');
    const [showAllAdress, setShowAllAdress] = useState(false); // see more or Hide address
    const [errFilter, setErrFilter] = useState(false); // hiện thị không tìm kiếm thấy
    const visibleAdress = showAllAdress ? currentListAdress : currentListAdress.slice(0, 5);
    const visibleBrands = showAllBrands ? brands : brands.slice(0, 5);
    let socket;
    const itemsPerPage = 4; // Số xe hiển thị mỗi trang

    const fetchAproveldCars = async () => {
        try {
            const response = await getCarApi();

            setCarList(response.data.data);
            setCarListStatic(response.data.data);
            if (isLoggedIn) {
                const response2 = await getCartApi();
                let cartIds = response2.data.data.carIds.map((item) => item._id);
                setcartsId(cartIds);
            }
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
        if (!usersOnline) return null;

        const userOn = usersOnline[sellerId];

        return userOn || null; // Trả về user nếu có, hoặc null nếu không có
    };
    // fun get getProvincesVn
    const getProvincesVn = async () => {
        try {
            const provincesRsp = await getProvincesApi();
            setCurrentListAdress(provincesRsp.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const getCarBrands = async () => {
        try {
            const brands = await getCarBrandsApi();
            setBrands(brands.data.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const handleFilter = async (currentAdress = null, currentBrand = null, closeCurrentFilter = null) => {
        try {
            if (currentAdress && !currentBrand) {
                if (currentAdress.province && !currentAdress.district) {
                    const provincesAndistricts = await getProvinceWithDistrictsApi(currentAdress.province.code);
                    let filterCarList = carListStatic.filter((car) => {
                        // lọc theo province
                        return car.address.province.code == currentAdress.province.code;
                    });
                    if (filterCarList.length < 1) {
                        setErrFilter(true);
                    }
                    setCarList(filterCarList);
                    setCurrentListAdress(provincesAndistricts.data.districts);
                    setCurrentDivisonType('Huyện/Quận');
                } else if (currentAdress.province && currentAdress.district) {
                    let filterCarList = carListStatic.filter((car) => {
                        // lọc theo disctrict
                        return car.address.district.code == currentAdress.district.code;
                    });

                    if (filterCarList.length < 1) {
                        setErrFilter(true);
                    }
                    setCarList(filterCarList);
                }
            }
            if (!currentAdress && currentBrand) {
                let filterCarList = carListStatic.filter((car) => {
                    return car.brand == currentBrand;
                });

                setCarList(filterCarList);
            }
            if (currentAdress && currentBrand) {
                if (currentAdress.province && !currentAdress.district) {
                    // check chỉ tỉnh
                    let filterCarList = carListStatic.filter((car) => {
                        return car.brand == currentBrand && car.address?.province.code == currentAdress.province.code;
                    });
                    setCarList(filterCarList);
                } else {
                    let filterCarList = carListStatic.filter((car) => {
                        return car.brand == currentBrand && car.address?.district.code == currentAdress.district.code;
                    });
                    setCarList(filterCarList);
                }
            }
            if (closeCurrentFilter == 'address') {
                setCurrentAdress({ province: null, district: null });
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

    const currentItems = carList
        .filter((item) => {
            return !(item.sellerId === user?.userId);
        })
        .slice(offset, offset + itemsPerPage);

    return (
        <div className={cx('wraper')}>
            <>
                <div className={cx('filter-header')}>
                    <ul className={cx('row-nowrap')}>
                        {currentAdress.province && (
                            <>
                                <li onClick={() => handleFilter(null, currentBrand, 'address')}>
                                    <strong>Khu vực </strong>
                                </li>

                                {Object.entries(currentAdress).map(([key, value]) => (
                                    <li
                                        key={key}
                                        onClick={() => {
                                            if (key === 'province') {
                                                currentAdress.district = null;
                                                handleFilter(currentAdress, currentBrand);
                                            } else {
                                                handleFilter(currentAdress, currentBrand);
                                            }
                                        }}
                                    >
                                        {value?.name ? (
                                            <>
                                                <FontAwesomeIcon icon={faArrowRight} /> {value.name}
                                            </>
                                        ) : (
                                            ''
                                        )}
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>
                    <ul className={cx('row-nowrap')}>
                        {currentBrand ? (
                            <>
                                <li onClick={() => handleFilter(currentAdress, null, 'brand')}>
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
                    {currentItems.length === 0 ? (
                        errFilter ? (
                            <div className="col">
                                <NotFound
                                    title={`Không tìm thấy `}
                                    describe={`Không tìm thấy kết quả cho  ${currentAdress.province?.name} ${currentAdress.district?.name} ${currentBrand}`}
                                />
                            </div>
                        ) : (
                            <div className="col">
                                <NotFound title={'Không có xe'} describe={'Hiện tại không có người đăng bán xe'} />
                            </div>
                        )
                    ) : (
                        <ul className={cx('product-list', 'col-full', 'flex-column')}>
                            {currentItems.map((car, index) => (
                                <Link to={`/car/${car._id}`}>
                                    <li className={cx('row-nowrap', 'boder_custom')} key={index}>
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
                                                            <div className={cx('cart-icon')}>
                                                                <FontAwesomeIcon icon={faCartShopping} />
                                                            </div>
                                                        </p>
                                                    )}

                                                    <div className={cx('chat-icon')}>
                                                        <p>
                                                            {' '}
                                                            <FontAwesomeIcon icon={faMessage} />
                                                        </p>
                                                    </div>
                                                    <div className={cx('location-icon')}>
                                                        <p>
                                                            {' '}
                                                            <FontAwesomeIcon icon={faLocationDot} />
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
                            {visibleAdress.map((a, index) => (
                                <li
                                    onClick={() => {
                                        if (currentBrand) {
                                            // if exist current brand will filter both of them
                                            if (a.division_type == 'huyện') {
                                                currentAdress.district = a;
                                            } else {
                                                currentAdress.province = a;
                                            }
                                            handleFilter(currentAdress, currentBrand);
                                        } else {
                                            if (a.division_type == 'huyện') {
                                                currentAdress.district = a;
                                            } else {
                                                currentAdress.province = a;
                                            }
                                            handleFilter(currentAdress);
                                        }
                                    }}
                                    key={index}
                                >
                                    {a.name}
                                </li>
                            ))}
                        </ul>
                        {currentListAdress.length > 5 && (
                            <Button onClick={() => setShowAllAdress(!showAllAdress)} primary>
                                {showAllAdress ? 'Thu gọn' : 'Xem thêm'}
                            </Button>
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
                            <Button onClick={() => setShowAllBrands(!showAllBrands)} primary>
                                {showAllBrands ? 'Thu gọn' : 'Xem thêm'}
                            </Button>
                        )}
                        <div className={cx('search')}>
                            <h3>search</h3>
                            <Search />
                        </div>
                    </div>

                    <div className={cx('filter_mobile', showFilter ? 'col-3' : '', 'flex-column')}>
                        <FontAwesomeIcon icon={faFilter} onClick={toggleShowFilter} />
                        {showFilter && (
                            <>
                                <ul className={cx('address-filter')}>
                                    <h3>{currentDivisonType}</h3>
                                    {visibleAdress.map((a, index) => (
                                        <li
                                            onClick={() => {
                                                if (currentBrand) {
                                                    // if exist current brand will filter both of them
                                                    if (a.division_type == 'huyện') {
                                                        currentAdress.district = a;
                                                    } else {
                                                        currentAdress.province = a;
                                                    }
                                                    handleFilter(currentAdress, currentBrand);
                                                } else {
                                                    if (a.division_type == 'huyện') {
                                                        currentAdress.district = a;
                                                    } else {
                                                        currentAdress.province = a;
                                                    }
                                                    handleFilter(currentAdress);
                                                }
                                            }}
                                            key={index}
                                        >
                                            {a.name}
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
                            </>
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
