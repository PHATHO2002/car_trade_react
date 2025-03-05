import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '~/api/api';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import DropdownMenu from '~/components/DropdownMenu/DropdownMenu';
import { useUserMenuItems, useAdminMenuItems } from '~/staticDataHook';
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
                <div className={cx('resume')}>
                    <img src="https://muaban.net/images/account/avatar-default.png"></img>
                    <p>
                        tham gia từ{' '}
                        {new Date(userData.createdAt).toLocaleDateString('vi-VN', {
                            month: 'long',
                            year: 'numeric',
                        })}{' '}
                    </p>
                </div>
                <DropdownMenu title={'Tiện ích'} items={userMenuItems} />
            </div>
            <div className={cx('col-full')}>
                <div className={cx('infor-detail')}>
                    {' '}
                    <div className="">
                        <h2 className="">Thông tin tài khoản</h2>
                        <div className="row-nowrap">
                            <label className="">Username:</label>
                            <p className="">{userData.username}</p>
                        </div>
                        <div className="row-nowrap">
                            <label className="">Email:</label>
                            <p className="">{userData.email}</p>
                        </div>
                        <div className="row-nowrap">
                            <label className="">Phone:</label>
                            <p className="">{userData.phone}</p>
                        </div>
                        <div className="row-nowrap">
                            <label className="">Address:</label>
                            <p className="">{userData.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Personal;
