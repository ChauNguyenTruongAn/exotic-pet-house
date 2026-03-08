import { useState, useEffect, useRef } from 'react';
import styles from './ModalAddProduct.module.scss';
import speciesApi from '../../../apis/admin/speciesApi';
import uploadImageApis from '../../../apis/admin/uploadImageApi';

const ModalAddProduct = ({ isShow, setIsShow, addItem }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null); // Ref để trigger input file ẩn

    // State danh sách loài
    const [speciesList, setSpeciesList] = useState([]);

    // State xử lý file và preview
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // Link preview cục bộ
    const [isUploading, setIsUploading] = useState(false); // Loading khi đang upload

    // State form data
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        imageLink: '', // Cái này sẽ có giá trị sau khi upload thành công
        description: '',
        speciesId: '',
    });

    // 1. Fetch Species & Set Default Species
    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await speciesApi.getAllSpecies();
                const list = response.data.data;
                setSpeciesList(list);
                if (list.length > 0) {
                    setFormData((prev) => ({ ...prev, speciesId: list[0].id }));
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách loài:', error);
            }
        };
        fetchSpecies();
    }, []);

    // Cleanup bộ nhớ preview khi component unmount hoặc file thay đổi
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // 2. Xử lý thay đổi input text thông thường
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'price' ? Number(value) : value,
        }));
    };

    // 3. Xử lý khi chọn file từ máy tính
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Tạo URL tạm thời để preview ngay lập tức
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    // Hàm trigger input file khi click vào vùng ảnh
    const handleTriggerFile = () => {
        fileInputRef.current.click();
    };

    // 4. Xử lý Lưu (Flow chính: Upload Ảnh -> Lấy Link -> Submit Form)
    const handleSave = async () => {
        // --- Validate ---
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }
        if (formData.price < 0) {
            alert('Giá bán không hợp lệ!');
            return;
        }
        // Bắt buộc phải chọn ảnh (tuỳ logic của bạn)
        if (!file && !formData.imageLink) {
            alert('Vui lòng chọn ảnh sản phẩm!');
            return;
        }

        setIsUploading(true); // Bắt đầu loading

        try {
            let finalImageLink = formData.imageLink;

            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);

                const response = await uploadImageApis.uploadImage(uploadData);


                if (response.data && response.data.data) {
                    finalImageLink = response.data.data;
                }
            }

            const finalProductData = {
                ...formData,
                imageLink: finalImageLink,
            };

            // Gọi hàm thêm sản phẩm từ props
            await addItem(finalProductData);

            // Reset hoặc đóng modal (tuỳ logic cha)
            setIsShow(false);
        } catch (error) {
            console.error('Lỗi khi upload hoặc lưu sản phẩm:', error);
            alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
        } finally {
            setIsUploading(false); // Tắt loading
        }
    };

    // Helper render ảnh preview
    const renderImagePreview = () => {
        // Ưu tiên hiển thị preview (ảnh mới chọn) -> sau đó đến imageLink (nếu đang edit)
        const displayImage = preview || formData.imageLink;

        return displayImage ? (
            <img
                src={displayImage}
                alt="Preview"
                className={styles['preview-img']} // Bạn nên style class này để object-fit: cover
                onClick={handleTriggerFile} // Cho phép click vào ảnh để chọn lại
                style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Error';
                }}
            />
        ) : (
            <div
                className={styles['no-image']}
                onClick={handleTriggerFile} // Click vào vùng trống cũng mở file
                style={{ cursor: 'pointer' }}
            >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <p>Nhấn để tải ảnh lên</p>
            </div>
        );
    };

    if (!isShow) return null;

    return (
        <div
            className={`${styles['modal-overlay']} ${isShow ? styles.show : ''}`}
            onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) {
                    setIsShow(false);
                }
            }}
        >
            {/* Input file bị ẩn, được trigger bởi ref */}

            <div className={styles['modal']} ref={modalRef}>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {/* --- Header --- */}
                <div className={styles['modal-header']}>
                    <h2>Thêm sản phẩm mới</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body (2 Cột) --- */}
                <div className={styles['modal-body']}>
                    {/* Cột Trái: Preview Ảnh */}
                    <div className={styles['left-column']}>
                        <div className={styles['image-preview-box']}>{renderImagePreview()}</div>
                        <div className={styles['info-note']}>
                            <p>Ảnh sẽ hiển thị tỷ lệ 1:1. Nhấn vào ảnh để thay đổi.</p>
                        </div>
                    </div>

                    {/* Cột Phải: Form */}
                    <div className={styles['right-column']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="name">
                                Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ví dụ: Thức ăn cho mèo..."
                                value={formData.name}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>

                        <div className={styles['row-group']}>
                            <div className={styles['form-group']}>
                                <label htmlFor="speciesId">Loài</label>
                                <select
                                    id="speciesId"
                                    value={formData.speciesId}
                                    onChange={handleChange}
                                    className={styles['custom-select']}
                                >
                                    {speciesList.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="price">Giá bán (VNĐ)</label>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={styles['custom-input']}
                                />
                            </div>
                        </div>

                        {/* Đã bỏ input nhập link ảnh thủ công */}

                        <div className={styles['form-group']}>
                            <label htmlFor="description">Mô tả chi tiết</label>
                            <textarea
                                id="description"
                                rows="3"
                                placeholder="Nhập thông tin chi tiết sản phẩm..."
                                value={formData.description}
                                onChange={handleChange}
                                className={styles['custom-textarea']}
                            />
                        </div>
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className={styles['modal-footer']}>
                    <button className={styles['btn-cancel']} onClick={() => setIsShow(false)} disabled={isUploading}>
                        Hủy bỏ
                    </button>
                    <button
                        className={styles['btn-save']}
                        onClick={handleSave}
                        disabled={isUploading} // Disable khi đang upload để tránh click nhiều lần
                    >
                        {isUploading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddProduct;
