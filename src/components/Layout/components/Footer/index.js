import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                        <h3>Liên hệ</h3>
                        <FontAwesomeIcon icon={faPhone} />
                        <p> 0123456789</p>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <p> phatho1508@gmail.com</p>
                    </div>
                </div>
                <div className={cx('footer-content__right')}>
                    <h3>Ứng dụng &amp; Kết nối</h3>
                    <ul class="row-nowrap">
                        <li className={cx('social-media-icon')}>
                            <a href="https://www.facebook.com/hx.phat/">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                        </li>
                        <li className={cx('social-media-icon')}>
                            <a href="/">
                                <FontAwesomeIcon icon={faTiktok} />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
