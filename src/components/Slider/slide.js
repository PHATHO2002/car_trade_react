import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretRight, faSquareCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './slide.scss.module.scss';
const cx = classNames.bind(styles);
const Slide = ({ images, closeSlide }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideRef = useRef();
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div onClick={closeSlide} className={cx('wraper')}>
            <div onClick={(e) => e.stopPropagation()} className={cx('slides')} ref={slideRef}>
                <div className={cx('prev')} onClick={prevSlide}>
                    <FontAwesomeIcon icon={faSquareCaretLeft} />
                </div>
                {images.map((img, index) => {
                    let className = 'next'; // Mặc định là ảnh tiếp theo

                    if (index === currentIndex) className = 'active';
                    else if (index === (currentIndex - 1 + images.length) % images.length) className = 'prev';

                    return <img key={index} src={img} alt={`Slide ${index + 1}`} className={cx(className)} />;
                })}
                <div className={cx('next')} onClick={nextSlide}>
                    <FontAwesomeIcon icon={faSquareCaretRight} />
                </div>
                <div className={cx('dots')}>
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={cx('dot', { active: index === currentIndex })}
                            onClick={() => setCurrentIndex(index)} // Click vào chấm để chuyển slide
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slide;
