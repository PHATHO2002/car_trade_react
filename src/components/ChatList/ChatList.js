import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatList.scss.module.scss';
import ChatBox from '../ChatBox/ChatBox';
import { getChatPartnersApi, getUnreadMessagesApi } from '~/api/chat';
const cx = classNames.bind(styles);
const ChatPartnerList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [listPartner, setlistPartner] = useState([]);
    const [receiverIdList, setReceiverIdList] = useState([]);
    const [countUnread, setCountUnread] = useState(0);
    const [unReadMess, setUnReadMess] = useState([]);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const user = useSelector((state) => state.auth.user);
    const contentRef = useRef(null);
    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };
    const handleOpenChatBox = (receiId, username) => {
        setReceiverIdList((prev) =>
            prev.some((item) => item.receiId === receiId) ? prev : [...prev, { receiId, username }],
        );
        setTimeout(() => {
            fetchListPartner();
        }, 500);
    };
    const closeChatBox = (receiId) => {
        setReceiverIdList((prev) => prev.filter((item) => item.receiId !== receiId));
    };
    const fetchListPartner = async () => {
        try {
            const response = await getChatPartnersApi();

            const response2 = await getUnreadMessagesApi();
            let list = response.data.data;
            setCountUnread(response2.data.data.length);
            setUnReadMess(response2.data.data);
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
        <div className={cx('wraper')} ref={contentRef}>
            <div onClick={toggleMenu} className={cx('chatPartIcon')}>
                <FontAwesomeIcon icon={faComment} />
                <span className={cx('quantity-unread')}>{countUnread}</span>
            </div>

            <div className={cx('inner', isOpen ? 'open' : 'close')}>
                <h3 className={cx('title')}>Đoạn chat</h3>
                <ul className={cx('list-partner')}>
                    {listPartner.map((partner) => (
                        <li
                            className="flex-column"
                            key={partner.id}
                            onClick={() => {
                                handleOpenChatBox(partner.id, partner.name);
                            }}
                        >
                            <span className={cx('partner-name')}>{partner.name}</span>
                            {partner.senderId == user.userId ? (
                                <div className={cx('newMess-group', 'row')}>
                                    <span className={cx('partner-newMess')}>Bạn:{partner.mess}</span>
                                </div>
                            ) : partner.isRead ? (
                                <div className={cx('newMess-group', 'row')}>
                                    <span className={cx('partner-newMess')}>{partner.mess}</span>
                                </div>
                            ) : (
                                <div className={cx('newMess-group', 'row')}>
                                    <span className={cx('partner-newMess', 'unread')}>{partner.mess} </span>
                                    <span className={cx('quantity-unRead-partner')}>
                                        {unReadMess.filter((item) => item.senderId === partner.id).length}
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={cx('listChatBox', 'row-nowrap')}>
                {receiverIdList.slice(-2).map((item) => (
                    <ChatBox
                        key={item.receiId}
                        receiverId={item.receiId}
                        username={item.username}
                        closeChatBox={closeChatBox}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatPartnerList;
