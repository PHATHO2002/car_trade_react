import { useEffect, useState } from 'react';
import api from '~/api/api';
import { faPenToSquare, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
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
    const [username2, setUsername2] = useState(''); // this one just set only once

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [editingField, setEditingField] = useState([]);
    const profileFields = [
        { label: 'Username', value: username, setValue: setUsername, field: 'username' },
        { label: 'Email', value: email, setValue: setEmail, field: 'email' },
        { label: 'Phone', value: phone, setValue: setPhone, field: 'phone' },
        { label: 'Address', value: address, setValue: setAddress, field: 'address' },
    ];
    const getUserData = async () => {
        try {
            const response = await api.get('/user/detail');
            setUsername(response.data.data.username);
            setUsername2(response.data.data.username);
            setEmail(response.data.data.email);
            setPhone(response.data.data.phone);
            setAddress(response.data.data.address);
            setCreatedAt(response.data.data.createdAt);
        } catch (error) {
            console.log(error);
        }
    };
    const displayEditField = (field) => {
        setEditingField((prev) => [...prev, field]);
    };
    const cancelEditField = (field) => {
        setEditingField((prev) => prev.filter((item) => !(item == field)));
    };
    // const update
    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className={cx('wraper', 'row-nowrap')}>
            <div className={cx('col-3', 'flex-column')}>
                <div className={cx('resume', 'flex-column')}>
                    <div className="col">
                        <img src="https://muaban.net/images/account/avatar-default.png"></img>
                    </div>

                    <div className="col">
                        <h3>{username2}</h3>
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
                            <li className="row-nowrap">
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
                </ul>
                <div style={{ marginTop: '1.6rem' }}>
                    {editingField.length > 0 ? <Button primary>Cập nhật</Button> : ''}
                </div>
            </div>
        </div>
    );
};

export default Personal;
