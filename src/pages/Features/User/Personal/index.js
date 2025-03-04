import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Personal.module.scss';
import { userMenuItems } from '~/staticData';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const Personal = () => {
    const userData = useSelector((state) => state.auth.user);

    return (
        <div className={cx('wraper')}>
            <div className={cx('head', '.flex-column')}>
                <img src="https://muaban.net/images/account/avatar-default.png"></img>
                <h3>{userData.username}</h3>
                <p>Vai trò {userData.role} </p>
            </div>
            <div className={cx('body')}>
                <ul className={cx('actions')}>
                    {userMenuItems.map((item, index) => (
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
                    ))}
                </ul>
                <div className={cx('infor-detail')}></div>
            </div>
        </div>
    );
};

export default Personal;
