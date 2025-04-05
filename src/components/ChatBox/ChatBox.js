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
import { sendMessApi, getMessWithPartnerApi, markReadedApi } from '~/api/chat';
const cx = classNames.bind(styles);
//test
const ChatBox = ({ receiverId, closeChatBox, username }) => {
    const [messages, setMessages] = useState([]); // Lưu trữ danh sách tin nhắn
    const [newMessage, setNewMessage] = useState(''); // Lưu trữ tin nhắn mới
    const user = useSelector((state) => state.auth.user);
    const messagesContainerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    let socket = connectSocket();
    const handleSendMess = async () => {
        try {
            await sendMessApi(receiverId, newMessage);
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
            const response = await getMessWithPartnerApi(receiverId);

            let messInRp = response.data.data;
            let unReadedMess = messInRp.filter((mess) => {
                return mess.isRead == false;
            });
            await markReadedApi(unReadedMess); // api đánh dấu đã đọc tn
            setMessages(messInRp);
        } catch (error) {
            console.log(error);
        }
    };
    const handleTypingInput = (e) => {
        if (socket) {
            socket.emit('typing', { senderId: user.userId, receiverId: receiverId });
        }
        setNewMessage(e.target.value);
    };
    useEffect(() => {
        fetchMess();
        if (socket) {
            socket.on('receive_message', (data) => {
                setMessages((prev) => [...prev, data]);
            });
            socket.on('typing', (data) => {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                // Đặt timeout mới để ẩn hiệu ứng sau 2 giây
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_messag');
                socket.off('send_message');
                socket.off('send_message_error');
                socket.off('typing');
            }
        };
    }, []);
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={cx('chat-box')}>
            <div className={cx('chat-header', 'row-space-between')}>
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
            <div className={cx('chat-messages', 'flex-column')} ref={messagesContainerRef}>
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
                {isTyping && (
                    <div className={cx('message_left', 'typing')}>
                        <span>Đang nhắn</span>
                    </div>
                )}
            </div>
            <div className={cx('chat-input', 'row')}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTypingInput(e)}
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
