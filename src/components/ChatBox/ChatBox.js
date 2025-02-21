import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '~/api/api';
import { connectSocket } from '~/utils/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChatBox.scss.module.scss';
import { useRef } from 'react';
import Button from '../Button';
const cx = classNames.bind(styles);

const ChatBox = ({ receiverId, closeChatBox, username }) => {
    const [messages, setMessages] = useState([]); // Lưu trữ danh sách tin nhắn
    const [newMessage, setNewMessage] = useState(''); // Lưu trữ tin nhắn mới
    const accessToken = useSelector((state) => state.auth.accessToken);
    const user = useSelector((state) => state.auth.user);
    const messagesContainerRef = useRef(null);
    let socket = connectSocket();
    const handleSendMess = async () => {
        try {
            await api.post('/user/chat-two', { receiverId: receiverId, message: newMessage });

            socket.emit('send_message', {
                senderId: user.userId,
                receiverId,
                message: newMessage,
                username: user.username,
            });
            socket.on('send_message_error', (data) => {
                console.log(data);
            });
            fetchMess();
            setNewMessage('');
        } catch (error) {
            console.log(error);
        }
    };
    const handleDate = (date) => {
        return date.toDateString() === new Date().toDateString() ? '' : date.toLocaleString();
    };
    const fetchMess = async () => {
        try {
            const response = await api.post('/user/get-message', { receiverId: receiverId });
            let messInRp = response.data.data;
            let unReadedMess = messInRp.filter((mess) => {
                return mess.isRead == false;
            });
            await api.post('/user/mark-readed-mess', { unReadedMess });
            setMessages(messInRp);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchMess();
            if (socket) {
                socket.on('receive_message', (data) => {
                    setMessages((prev) => [...prev, data]);
                });
            }
        }

        return () => {
            if (socket) {
                socket.off('receive_messag');
                socket.off('send_message');
                socket.off('send_message_error');
            }
        };
    }, [accessToken]);
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className={cx('chat-box')}>
            <div className={cx('chat-header')}>
                <h3>{username}</h3>
                <div
                    className={cx('close-icon')}
                    onClick={() => {
                        closeChatBox(receiverId);
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <div className={cx('chat-messages')} ref={messagesContainerRef}>
                {messages.map((mess, index) => {
                    const isCurrentUser = user.userId === mess.senderId;

                    return isCurrentUser ? (
                        <div className={cx('message_right')} key={mess._id || index}>
                            {/* <strong>avatar1</strong> */}
                            <span>{mess.message}</span>
                            {mess.timestamp ? <small>{handleDate(new Date(mess.timestamp))}</small> : ''}
                        </div>
                    ) : (
                        <div className={cx('message_left')} key={mess._id || index}>
                            {/* <strong> avatar2</strong> */}
                            <span>{mess.message}</span>
                            {mess.timestamp ? <small>{handleDate(new Date(mess.timestamp))}</small> : ''}
                        </div>
                    );
                })}
            </div>
            <div className={cx('chat-input')}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button onClick={handleSendMess} primary>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default ChatBox;
