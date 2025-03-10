import { useEffect, useState, useRef } from 'react';
import api from '~/api/api';
import axios from 'axios';
import { faPenToSquare, faRectangleXmark, faCaretLeft, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import { useUserMenuItems, useAdminMenuItems } from '~/staticData';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
const Personal = () => {
    const userMenuItems = useUserMenuItems();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState({});
    const [err, setErr] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [editingField, setEditingField] = useState([]);

    // handler select address
    const [currentProvice, setCurrentProvice] = useState({});
    const [currentDistrict, setCurrentDistrict] = useState({});
    const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0); // to get all of
    const [currentWardsDistrict, setCurrentWardsDistrict] = useState({});
    const districtSelectRef = useRef(null);
    const wardSelectRef = useRef(null);
    const handlerSelectAddress = (event, addressOption) => {
        const selectedIndex = event.target.selectedIndex;
        let text = event.target.options[selectedIndex].text;
        let indexDistrictSelected = event.target.options[selectedIndex].index;
        switch (addressOption) {
            case 'province':
                setCurrentProvice({ code: event.target.value, name: text });

                break;
            case 'district':
                setCurrentDistrict({ code: event.target.value, name: text });
                setCurrentDistrictIndex(Number(indexDistrictSelected));
                break;
            case 'WardsDistrict':
                setCurrentWardsDistrict({ code: event.target.value, name: text });

                break;
        }
    };
    // handler address
    const [provinceVns, setProvinceVns] = useState([]); // get all province of vietnam
    const [districtOfProvince, setDistrictOfProvince] = useState([]); // get all districtOfProvince

    const getProvincesVn = async () => {
        try {
            const provincesRsp = await axios.get('https://provinces.open-api.vn/api/p');
            setProvinceVns(provincesRsp.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };
    const getDistrictOfProvince = async () => {
        // get all district of Province
        try {
            if (currentProvice.code) {
                const provincesAndistricts = await axios.get(
                    `https://provinces.open-api.vn/api/p/${currentProvice.code}?depth=3`,
                );

                setDistrictOfProvince(provincesAndistricts.data.districts);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const profileFields = [
        { label: 'Email', value: email, setValue: setEmail, field: 'email' },
        { label: 'Phone', value: phone, setValue: setPhone, field: 'phone' },
    ];
    const getUserData = async () => {
        try {
            const response = await api.get('/user/detail');

            setUsername(response.data.data.username);
            setEmail(response.data.data.email);
            setPhone(response.data.data.phone);
            setAddress(response.data.data.address);
            setCurrentProvice(response.data.data.address.province);
            setCurrentDistrict(response.data.data.address.district);
            setCurrentWardsDistrict(response.data.data.address.ward);
            setCreatedAt(response.data.data.createdAt);
        } catch (error) {
            console.log(error);
        }
    };
    // handle disp lay edit screen
    const displayEditField = (field) => {
        setEditingField((prev) => [...prev, field]);
    };
    const cancelEditField = (field) => {
        setEditingField((prev) => prev.filter((item) => !(item == field)));
    };

    const updateUserInfor = async () => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/; // Hỗ trợ số điện thoại Việt Nam

            if (!emailRegex.test(email)) {
                setErr('Email không hợp lệ.');
                return;
            }

            if (!phoneRegex.test(phone)) {
                setErr('Số điện thoại không hợp lệ.');
                return;
            }

            setErr('');

            if (districtSelectRef.current && wardSelectRef.current) {
                // cập nhập dữ liệu option hieent thị hiện tại
                await api.put('/user', {
                    username,
                    email,
                    phone,
                    address: {
                        province: currentProvice,
                        district: {
                            code: districtSelectRef.current.value,
                            name: districtSelectRef.current.options[districtSelectRef.current.selectedIndex].text,
                        },
                        ward: {
                            code: wardSelectRef.current.value,
                            name: wardSelectRef.current.options[wardSelectRef.current.selectedIndex].text,
                        },
                    },
                });
            }
            toast.success('cập nhập thông tin thành công');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
        getProvincesVn();
    }, []);

    useEffect(() => {
        if (currentProvice.code) {
            getDistrictOfProvince();
        } else {
            setDistrictOfProvince([]);
        }
    }, [currentProvice]);

    return (
        <div className={cx('wraper', 'row-nowrap')}>
            <div className={cx('col-3', 'flex-column')}>
                <div className={cx('resume', 'flex-column')}>
                    <div className="col">
                        <img src="https://muaban.net/images/account/avatar-default.png"></img>
                    </div>

                    <div className="col">
                        <h3>{username}</h3>
                        <p>
                            tham gia từ{' '}
                            {new Date(createdAt).toLocaleDateString('vi-VN', {
                                month: 'long',
                                year: 'numeric',
                            })}{' '}
                        </p>
                    </div>
                </div>
                <ul className={cx('actions')}>
                    <h3>Cá nhân</h3>
                    {userMenuItems.map((item, index) => {
                        return (
                            <li key={index} onClick={item.onClick ? item.onClick : undefined}>
                                {item.to ? (
                                    <Link className={cx('link')} to={item.to}>
                                        {item.icon && <span className={cx('icon')}>{item.icon}</span>}
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span>
                                        {' '}
                                        {item.icon && <span className={cx('icon')}>{item.icon}</span>}
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={cx('col-full')}>
                <ul className={cx('infor-detail', 'flex-column')}>
                    <h2>Thông tin tài khoản</h2>
                    {profileFields.map((item, index) => {
                        return (
                            <li key={index} className="row-nowrap">
                                <div className="col-3">
                                    <p className={cx('label')}>{item.label} </p>
                                </div>
                                <div className={cx('col-full', 'value')}>
                                    <div className={cx('row-space-between')}>
                                        {editingField.includes(item.label) ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={item.value}
                                                    onChange={(e) => item.setValue(e.target.value)}
                                                    className={cx('input-field', 'col-full')}
                                                />
                                                <div
                                                    onClick={() => {
                                                        cancelEditField(item.label);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faRectangleXmark} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>{item.value}</p>

                                                <div onClick={() => displayEditField(item.label)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    <li className="row-nowrap">
                        {/* xử lý address */}
                        <div className="col-3">
                            <p className={cx('label')}>Address</p>
                        </div>
                        <div className={cx('col-full', 'value')}>
                            <div className={cx('row-space-between')}>
                                {editingField.includes('Address') ? (
                                    <>
                                        <select
                                            id="selectBoxProvince"
                                            value={currentProvice.code}
                                            onChange={(e) => {
                                                handlerSelectAddress(e, 'province');
                                            }}
                                        >
                                            <option value="">--Chọn tỉnh hoặc thành phố--</option>
                                            {provinceVns.map((province, index) => {
                                                return (
                                                    <option key={index} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        <select
                                            id="selectBoxDistricts"
                                            value={currentDistrict.code}
                                            ref={districtSelectRef}
                                            onChange={(e) => {
                                                handlerSelectAddress(e, 'district');
                                            }}
                                        >
                                            {districtOfProvince.map((district, index) => {
                                                return (
                                                    <option key={index} index={index} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                );
                                            })}
                                        </select>

                                        <select
                                            id="selectBoxWardsDistricts"
                                            value={currentWardsDistrict.code}
                                            ref={wardSelectRef}
                                            onChange={(e) => {
                                                handlerSelectAddress(e, 'WardsDistrict');
                                            }}
                                        >
                                            {districtOfProvince[currentDistrictIndex]?.wards.map((e, index) => {
                                                return (
                                                    <option key={index} value={e.code}>
                                                        {e.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div
                                            onClick={() => {
                                                cancelEditField('Address');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faRectangleXmark} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            {address?.province?.name},{address?.district?.name},{address?.ward?.name}
                                        </p>

                                        <div onClick={() => displayEditField('Address')}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </li>
                </ul>
                <p>{err}</p>
                <div style={{ marginTop: '1.6rem' }}>
                    {editingField.length > 0 ? (
                        <Button onClick={updateUserInfor} primary>
                            Cập nhật
                        </Button>
                    ) : (
                        ''
                    )}
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default Personal;
