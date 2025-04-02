import classNames from 'classnames/bind';
import styles from './AdminHomePage.module.scss';
import MyChart from '~/components/Chart';
import { getBrandCountByMonthApi } from '~/api/car';
import { useEffect, useState } from 'react';
import { connectSocket } from '~/utils/socket';
import { faSquareCaretLeft, faSquareCaretRight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

function AdminHomePage() {
    const [dataBrandAmountPost, setDataBrandAmountPost] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isFuture, setIsFuture] = useState(false);
    const [usersOnline, setUserOnline] = useState(null);
    let socket;
    const handleBrandAmountBymoth = async (month = null, year = null) => {
        try {
            const response = await getBrandCountByMonthApi(month, year);
            setDataBrandAmountPost(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChangeMonth = async (isNextOrPre) => {
        if (isNextOrPre == 'next') {
            if (currentMonth == 12) {
                setCurrentMonth(1);
                setCurrentYear((prev) => prev + 1);
            } else {
                setCurrentMonth((prev) => prev + 1);
            }
        } else {
            if (currentMonth == 1) {
                setCurrentMonth(12);
                setCurrentYear((prev) => prev - 1);
            } else {
                setCurrentMonth((prev) => prev - 1);
            }
        }
    };
    const handleisFuture = async () => {
        const today = new Date();
        const currentDateMonth = today.getMonth() + 1; // getMonth() trả về tháng từ 0-11, nên cộng thêm 1
        const currentDateYear = today.getFullYear();
        if (currentYear <= currentDateYear) {
            if (currentYear == currentDateYear) {
                if (currentMonth >= currentDateMonth) {
                    setIsFuture(true); // Tháng trong năm hiện tại nhưng ở trong tương lai
                    return;
                }
            }
        } else {
            setIsFuture(true);
            return;
        }
        setIsFuture(false);
        return;
    };
    useEffect(() => {
        handleBrandAmountBymoth(currentMonth, currentYear);
        handleisFuture();
    }, [currentMonth]);
    useEffect(() => {
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
    return (
        <div className={cx('wraper')}>
            <div className={cx('dashboard-container')}>
                <div className={cx('chart')}>
                    <div className={cx('chart-head', 'row-nowrap')}>
                        <Button
                            onClick={() => {
                                handleChangeMonth('prev');
                            }}
                            primary
                            title={'tháng trước'}
                        >
                            <FontAwesomeIcon icon={faSquareCaretLeft} /> Tháng trước
                        </Button>

                        <h3>{`Số lưỡng xe được đăng bán tháng ${currentMonth} năm ${currentYear}`}</h3>
                        {isFuture ? (
                            ''
                        ) : (
                            <Button
                                onClick={() => {
                                    handleChangeMonth('next');
                                }}
                                primary
                                title={'tháng tiếp'}
                            >
                                Tháng tiếp theo <FontAwesomeIcon icon={faSquareCaretRight} />
                            </Button>
                        )}
                    </div>
                    <MyChart title="" data={dataBrandAmountPost} type="bar" name="brand" dataKey="count" />
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;
