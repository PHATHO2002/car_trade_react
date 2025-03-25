import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer className={cx('wraper')}>
            <div className={cx('footer-content', 'row-nowrap')}>
                <div className={cx('footer-content__left')}>
                    <div className={cx('logo')}>
                        <img src="\images\logo-removebg.svg" alt="Mua bán xe ô tô" />
                    </div>
                    <div className={cx('contact')}>
                        <p>Liên hệ: 0123456789</p>
                        <p>Email: phatho1508@gmail.com</p>
                    </div>
                </div>
                <div className={cx('footer-content__right')}>
                    <ul className={cx('footer-menu')}></ul>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
