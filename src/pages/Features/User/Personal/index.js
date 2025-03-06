import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '~/api/api';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import { useUserMenuItems, useAdminMenuItems } from '~/staticData';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const Personal = () => {
    const [userData, setUserData] = useState({});
    const userMenuItems = useUserMenuItems();
    const getUserData = async () => {
        try {
            const response = await api.get('/user/detail');
            setUserData(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className={cx('wraper', 'row-nowrap')}>
            <div className={cx('col-3', '.flex-column')}>
                <div className={cx('resume', 'row-nowrap')}>
                    <img src="https://muaban.net/images/account/avatar-default.png"></img>
                    <div>
                        <h3>{userData.username}</h3>
                        <p>
                            tham gia từ{' '}
                            {new Date(userData.createdAt).toLocaleDateString('vi-VN', {
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

                    <li className="row-nowrap">
                        <div className="col-3">
                            <label className={cx('label')}>Username:</label>
                        </div>
                        <div className="col-full">
                            <div className={cx('row-space-between')}>
                                <p>{userData.username}</p>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                        </div>
                    </li>

                    <li className="row-nowrap">
                        <div className="col-3">
                            <label className={cx('label')}>Email:</label>
                        </div>
                        <div className="col-full">
                            <div className={cx('row-space-between')}>
                                <p>{userData.email}</p>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                        </div>
                    </li>

                    <li className="row-nowrap">
                        <div className="col-3">
                            <label className={cx('label')}>Phone:</label>
                        </div>
                        <div className="col-full">
                            <div className={cx('row-space-between')}>
                                <p>{userData.phone}</p>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                        </div>
                    </li>

                    <li className="row-nowrap">
                        <div className="col-3">
                            <label className={cx('label')}>Address:</label>
                        </div>
                        <div className="col-full">
                            <div className={cx('row-space-between')}>
                                <p>{userData.address}</p>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Personal;
