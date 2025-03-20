import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import Button from '~/components/Button';
import { useEffect, useState, useRef } from 'react';
import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/api/api';
import { connectSocket } from '~/utils/socket';
const cx = classNames.bind(styles);

function Post() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);
    const [year, setYear] = useState('');
    const [condition, setCondition] = useState('');
    const [mileage, setMileage] = useState('');
    const [carImages, setCarImages] = useState([]);
    const [documentImages, setDocumentImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const carImagesInputRef = useRef(null);
    const documentImagesInputRef = useRef(null);

    let socket = connectSocket();

    // Xử lý khi chọn file
    const handleFileChange = (e) => {
        switch (e.target.id) {
            case 'carImages': {
                const files = Array.from(e.target.files);
                if (files.length > 10 || carImages.length >= 10) {
                    setErrors((prev) => ({ ...prev, carimages: 'Bạn chỉ được tải lên tối đa 10 ảnh!' }));
                } else {
                    setCarImages((prev) => [...prev, ...files]);
                    setErrors((prev) => ({ ...prev, carimages: '' }));
                }
                break;
            }

            case 'documentImages': {
                const files = Array.from(e.target.files);
                if (files.length > 10) {
                    setErrors((prev) => ({ ...prev, docimages: 'Bạn chỉ được tải lên tối đa 10 ảnh!' }));
                } else {
                    setDocumentImages((prev) => [...prev, ...files]);
                    setErrors((prev) => ({ ...prev, docimages: '' }));
                }
                break;
            }
            default:
                break;
        }
    };
    const handleSelectBrand = (e) => {
        setBrand(e.target.value);
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

        // Kiểm tra năm sản xuất
        if (!year) {
            newErrors.year = 'Vui lòng chọn năm sản xuất!';
        }

        // Kiểm tra số km đã đi
        if (!mileage.trim()) {
            newErrors.mileage = 'Số km đã đi không được để trống!';
        } else if (isNaN(Number(mileage)) || Number(mileage) < 0) {
            newErrors.mileage = 'Số km phải là số và không được âm!';
        }

        // Kiểm tra tình trạng xe
        if (!condition.trim()) {
            newErrors.condition = 'Vui lòng nhập tình trạng xe!';
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

        // Kiểm tra ảnh xe
        if (carImages.length === 0) {
            newErrors.carImages = 'Vui lòng tải lên ít nhất một hình ảnh về xe!';
        }

        // Kiểm tra ảnh giấy tờ xe
        if (documentImages.length === 0) {
            newErrors.documentImages = 'Vui lòng tải lên ít nhất một hình ảnh giấy tờ xe!';
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
                formData.append('title', title);
                formData.append('price', price);
                formData.append('brand', brand);
                formData.append('year', year);
                formData.append('condition', condition);
                formData.append('mileage', mileage);
                formData.append('description', description);
                carImages.forEach((file) => {
                    formData.append('carImages', file);
                });
                documentImages.forEach((file) => {
                    formData.append('documentImages', file);
                });

                const response = await api.post('/car', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (socket) {
                    socket.emit('addnewPendingCar', response.data.data);
                }
                toast.success(
                    'Đăng tin bán xe thành công đang chờ admin duyệt! chúng tôi cũng đã gửi mail chúc mừng bạn',
                );
                setTitle('');
                setBrand('');
                setPrice('');
                setYear('');
                setMileage('');
                setDescription('');
                carImagesInputRef.current.value = '';
                documentImagesInputRef.current.value = '';
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    };
    const getBrands = async () => {
        try {
            const rsp = await api.get('/car/brands');
            setBrands(rsp.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getBrands();
    }, []);
    return (
        <div className={cx('wraper')}>
            <form className={cx('post-form')} onSubmit={handleSubmit}>
                <h3>Đăng tin </h3>
                <div className="row-nowrap">
                    <div className="col">
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
                            <label htmlFor="brand">Chọn một hãng xe :</label>
                            <select id="brand" value={brand} onChange={handleSelectBrand}>
                                {brands.map((e, index) => {
                                    return (
                                        <option key={index} value={e.name}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.brand && (
                                <p className={cx('error')}>
                                    {errors.brand}
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </p>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="year">Năm sản xuất:</label>
                            <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                                <option value="">Chọn năm</option>
                                {Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => (
                                    <option key={i} value={1980 + i}>
                                        {1980 + i}
                                    </option>
                                ))}
                            </select>
                            {errors.year && (
                                <p className={cx('error')}>
                                    {errors.year}
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </p>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="price">Số km đã đi:</label>
                            <input
                                type="number"
                                id="mileage"
                                placeholder="Nhập vào số km đã đi "
                                value={mileage}
                                onChange={(e) => setMileage(e.target.value)}
                            />
                            {errors.mileage && (
                                <p className={cx('error')}>
                                    {errors.mileage}
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </p>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="title">Tình trạng:</label>
                            <input
                                type="text"
                                id="condition"
                                placeholder=" vd: mới mua hoặc cũ ... "
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            />
                            {errors.condition && (
                                <p className={cx('error')}>
                                    {errors.condition}
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
                    </div>
                    <div className="col">
                        <div className={cx('form-group')}>
                            <h4>Tải lên hình ảnh về xe</h4>

                            <div className={cx('box-image', 'row')}>
                                <label htmlFor="carImages" className={cx('upload-label')}>
                                    {' '}
                                    <FontAwesomeIcon icon={faPlus} />{' '}
                                </label>

                                <input
                                    id="carImages"
                                    accept="image/png, image/jpeg, image/gif"
                                    className={cx('choose-file')}
                                    type="file"
                                    onChange={handleFileChange}
                                    ref={carImagesInputRef}
                                />
                                {carImages.map((file, index) => (
                                    <img key={index} src={URL.createObjectURL(file)} alt={`Car ${index + 1}`} />
                                ))}
                            </div>

                            {errors.carimages && (
                                <p className={cx('error')}>
                                    {errors.carimages}
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </p>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <h4> Tải lên hình ảnh về giấy tờ xe</h4>

                            <div className={cx('box-image', 'row')}>
                                <label htmlFor="documentImages" className={cx('upload-label')}>
                                    {' '}
                                    <FontAwesomeIcon icon={faPlus} />{' '}
                                </label>
                                <input
                                    id="documentImages"
                                    accept="image/png, image/jpeg, image/gif"
                                    className={cx('choose-file')}
                                    type="file"
                                    onChange={handleFileChange}
                                    ref={documentImagesInputRef}
                                />
                                {documentImages.map((file, index) => (
                                    <img key={index} src={URL.createObjectURL(file)} alt={`Car ${index + 1}`} />
                                ))}
                            </div>

                            {errors.images && (
                                <p className={cx('error')}>
                                    {errors.images}
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </p>
                            )}
                        </div>
                    </div>
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
