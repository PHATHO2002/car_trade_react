import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '~/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatList.scss.module.scss';
const cx = classNames.bind(styles);
const ChatPartnerList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [listPartner, setlistPartner] = useState([]);
    const [countUnread, setCountUnread] = useState(0);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const user = useSelector((state) => state.auth.user);
    const contentRef = useRef(null);
    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };
    const fetchListPartner = async () => {
        try {
            const response = await api.get('/user/get-list-chat-partner');
            let list = response.data.data;
            let count = 0;
            list.forEach((element) => {
                if (!(element.id == user.userId || element.isRead)) count += 1;
            });
            setCountUnread(count);
            setlistPartner(list);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (accessToken) {
            fetchListPartner();
        }
    }, [accessToken]);
    return (
        <div className={cx('ChatPartnerList')}>
            <div onClick={toggleMenu} className={cx('chatPartIcon')}>
                <FontAwesomeIcon icon={faComment} />
                <span className={cx('quantity-unread')}>{countUnread}</span>
            </div>
            {isOpen ? (
                <div className={cx('container')} ref={contentRef}>
                    <h2 className={cx('title')}>Đoạn chat</h2>
                    <ul className={cx('list-partner')}>
                        {listPartner.map((partner) => (
                            <li key={partner.id}>
                                <span className={cx('partner-name')}>{partner.name}</span>
                                <span className={cx('partner-newMess')}>{partner.mess}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ChatPartnerList;
