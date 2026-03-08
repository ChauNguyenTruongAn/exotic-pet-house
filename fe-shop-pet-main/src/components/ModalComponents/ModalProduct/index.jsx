import { useState, useEffect, useRef } from 'react';
import styles from './ModalProduct.module.scss'; // Đảm bảo file style này tồn tại
import speciesApi from '../../../apis/admin/speciesApi';
import uploadImageApis from '../../../apis/admin/uploadImageApi'; // Import API upload

const ModalProduct = ({ isShow, setIsShow, selectedItem, updateItem }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null); // Ref cho input file

    // State danh sách loài
    const [speciesList, setSpeciesList] = useState([]);

    // State xử lý file
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // Preview cho ảnh MỚI chọn
    const [isUploading, setIsUploading] = useState(false);

    // State form data
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
        imageLink: '', // Link ảnh cũ (từ server)
        description: '',
        speciesId: '',
    });

    // 1. Fetch danh sách loài
    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await speciesApi.getAllSpecies();
                setSpeciesList(response.data.data);
            } catch (error) {
                console.error('Lỗi lấy danh sách loài:', error);
            }
        };
        fetchSpecies();
    }, []);

    // 2. Fill dữ liệu khi selectedItem thay đổi (Mở modal edit)
    useEffect(() => {
        if (selectedItem) {
            setFormData({
                id: selectedItem.id,
                name: selectedItem.name || '',
                price: selectedItem.price || 0,
                imageLink: selectedItem.imageLink || '',
                description: selectedItem.description || '',
                speciesId: selectedItem.speciesId || '',
            });

            // Quan trọng: Reset file và preview mỗi khi mở modal edit một item mới
            setFile(null);
            setPreview(null);
        }
    }, [selectedItem]);

    // Cleanup preview URL để tránh leak memory
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Xử lý thay đổi input text
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'price' ? Number(value) : value,
        }));
    };

    // Xử lý chọn file mới
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    // Trigger input file
    const handleTriggerFile = () => {
        fileInputRef.current.click();
    };

    // Xử lý LƯU
    const handleSave = async () => {
        // Validate cơ bản
        if (!formData.name.trim() || formData.price < 0) {
            alert('Vui lòng kiểm tra lại Tên và Giá sản phẩm!');
            return;
        }

        setIsUploading(true);

        try {
            let finalImageLink = formData.imageLink; // Mặc định dùng link cũ

            // Nếu người dùng CÓ chọn file mới -> Upload
            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);

                const response = await uploadImageApis.uploadImage(uploadData);
                if (response.data && response.data.data) {
                    finalImageLink = response.data.data; // Cập nhật link mới
                }
            }

            const updatedItem = {
                ...formData,
                imageLink: finalImageLink, // Gửi link (mới hoặc cũ) về server
            };

            await updateItem(updatedItem);

            // Logic đóng modal thường nằm ở component cha sau khi update xong,
            // hoặc bạn có thể gọi setIsShow(false) ở đây nếu muốn.
        } catch (error) {
            console.error('Lỗi cập nhật sản phẩm:', error);
            alert('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setIsUploading(false);
        }
    };

    // Logic hiển thị ảnh: Ưu tiên Preview (ảnh mới) > ImageLink (ảnh cũ) > Placeholder
    const renderImagePreview = () => {
        const displaySrc = preview || formData.imageLink;

        return displaySrc ? (
            <img
                src={displaySrc}
                alt="Preview"
                onClick={handleTriggerFile}
                style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
            />
        ) : (
            <div className={styles['no-image']} onClick={handleTriggerFile} style={{ cursor: 'pointer' }}>
                <i className="fa-regular fa-image"></i>
                <p>Bấm để thêm ảnh</p>
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
            <div className={styles['modal']} ref={modalRef}>
                {/* --- FIX LỖI: Input nằm TRONG modalRef để tránh click bị đóng modal --- */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    onClick={(e) => e.stopPropagation()}
                />

                {/* --- Header --- */}
                <div className={styles['modal-header']}>
                    <h2>Chỉnh sửa sản phẩm</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body (Chia 2 cột) --- */}
                <div className={styles['modal-body']}>
                    {/* Cột Trái: Ảnh Preview */}
                    <div className={styles['left-column']}>
                        <div className={styles['image-preview-box']}>{renderImagePreview()}</div>
                        <div className={styles['id-badge']}>ID: #{formData.id}</div>
                        {/* Gợi ý nhỏ cho UX */}
                        <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Nhấn vào ảnh để thay đổi
                        </div>
                    </div>

                    {/* Cột Phải: Form Input */}
                    <div className={styles['right-column']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="name">
                                Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
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
                                    <option value="">-- Chọn loài --</option>
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

                        {/* Đã xóa input nhập link ảnh thủ công */}

                        <div className={styles['form-group']}>
                            <label htmlFor="description">Mô tả chi tiết</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles['custom-textarea']}
                                rows="4"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className={styles['modal-footer']}>
                    <button className={styles['btn-cancel']} onClick={() => setIsShow(false)} disabled={isUploading}>
                        Hủy bỏ
                    </button>
                    <button className={styles['btn-save']} onClick={handleSave} disabled={isUploading}>
                        {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalProduct;
