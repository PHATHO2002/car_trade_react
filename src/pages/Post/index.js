import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import Button from '~/components/Button';
import { useEffect, useState } from 'react';
import { faCameraRetro, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/api/api';
import { connectSocket } from '~/utils/socket';
let socket;
const cx = classNames.bind(styles);

function Post() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    // Xử lý khi chọn file
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) {
            setErrors((prev) => ({ ...prev, images: 'Bạn chỉ được tải lên tối đa 10 ảnh!' }));
        } else {
            setImages(files);
            setErrors((prev) => ({ ...prev, images: '' }));
        }
    };

    // Validate form trước khi gửi
    const validateForm = () => {
        let newErrors = {};

        // Kiểm tra tiêu đề
        if (!title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống!';
        } else if (title.trim().length < 5) {
            newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự.';
        }

        // Kiểm tra giá bán
        if (!price.trim()) {
            newErrors.price = 'Giá không được để trống!';
        } else if (isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = 'Giá bán phải là số và lớn hơn 0.';
        }

        // Kiểm tra mô tả
        if (!description.trim()) {
            newErrors.description = 'Miêu tả không được để trống!';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Miêu tả phải có ít nhất 10 ký tự.';
        }

        // Kiểm tra địa chỉ
        if (!address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống!';
        }

        // Kiểm tra hình ảnh
        if (images.length === 0) {
            newErrors.images = 'Bạn phải tải lên ít nhất 1 ảnh!';
        } else if (images.length > 10) {
            newErrors.images = 'Bạn chỉ được tải lên tối đa 10 ảnh!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý khi submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                const formData = new FormData();
                const data = JSON.parse(localStorage.getItem('userData'));
                const sellerId = data.userId;
                formData.append('title', title);
                formData.append('price', price);
                formData.append('address', address);
                formData.append('description', description);
                formData.append('sellerId', sellerId);

                images.forEach((file) => {
                    formData.append('images', file);
                });
                const response = await api.post('/user/post', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                socket.emit('addnewPendingCar', response.data.data);
                toast.success('Đăng tin bán xe thành công đang chờ admin duyệt!');
                setTitle('');
                setAddress('');
                setDescription('');
                setImages([]);
                setPrice('');
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        socket = connectSocket();
    }, []);
    return (
        <div className={cx('post-page')}>
            <form className={cx('post-form')} onSubmit={handleSubmit}>
                <h2>Đăng tin bán xe</h2>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tiêu đề:</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Nhập tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                        <p className={cx('error')}>
                            {errors.title}
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="price">Giá:</label>
                    <input
                        type="text"
                        id="price"
                        placeholder="Nhập vào giá"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && (
                        <p className={cx('error')}>
                            {errors.price}
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="address">Địa chỉ:</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Nhập vào địa chỉ bán"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && (
                        <p className={cx('error')}>
                            {errors.address}
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="description">Miêu tả:</label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Nhập vào miêu tả"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                        <p className={cx('error')}>
                            {errors.description}
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="images">
                        {' '}
                        Tải lên hình ảnh về xe <FontAwesomeIcon icon={faCameraRetro} />{' '}
                    </label>
                    <input
                        id="images"
                        accept="image/png, image/jpeg, image/gif"
                        className={cx('choose-file')}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    {errors.images && (
                        <p className={cx('error')}>
                            {errors.images}
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </p>
                    )}
                </div>
                {loading ? (
                    <Button disabled primary>
                        <p className={cx('post-btn')}>loading</p>
                    </Button>
                ) : (
                    <Button primary>
                        <p className={cx('post-btn')}>Đăng tin</p>
                    </Button>
                )}
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Post;
