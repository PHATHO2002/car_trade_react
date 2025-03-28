import classNames from 'classnames/bind';
import styles from './AdminHomePage.module.scss';
import MyChart from '~/components/Chart';
import { getCarBrandsApi, getBrandCountByMonthApi } from '~/api/car';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

function AdminHomePage() {
    const [dataBrandAmountPost, setDataBrandAmountPost] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const handleBrandAmountBymoth = async (month = null, year = null) => {
        const response = await getBrandCountByMonthApi(month, year);
        setDataBrandAmountPost(response.data.data);
        try {
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handleBrandAmountBymoth();
    }, []);
    return (
        <div className={cx('wraper')}>
            <div className={cx('dashboard-container')}>
                <MyChart
                    title={`Số lưỡng xe được đăng bán tháng ${currentMonth} năm ${currentYear}`}
                    data={dataBrandAmountPost}
                    type="bar"
                    name="brand"
                    dataKey="count"
                />
            </div>
        </div>
    );
}

export default AdminHomePage;
