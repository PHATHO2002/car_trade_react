import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretLeft, faSquareCaretDown } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import styles from './DropdownMenu.scss.module.scss';

const cx = classNames.bind(styles);

const DropdownMenu = ({ title = '', items = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={cx('dropdown')} ref={menuRef}>
            <div className={cx('dropdown-button')} onClick={toggleMenu}>
                {isOpen ? <FontAwesomeIcon icon={faSquareCaretDown} /> : <FontAwesomeIcon icon={faSquareCaretLeft} />}
            </div>
            {isOpen && (
                <ul className={cx('dropdown-menu')}>
                    {items.map((item, index) => (
                        <li key={index} onClick={item.onClick ? item.onClick : undefined}>
                            {item.to ? (
                                <Link
                                    className={cx('link', 'row-nowrap')}
                                    to={item.to}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon && <span className={cx('icon')}>{item.icon}</span>}
                                    {item.label && <span className={cx('text')}>{item.label}</span>}
                                </Link>
                            ) : (
                                <span className={cx('row-nowrap')}>
                                    {' '}
                                    {item.icon && <span className={cx('icon')}>{item.icon}</span>}
                                    {item.label && <span className={cx('text')}>{item.label}</span>}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;
