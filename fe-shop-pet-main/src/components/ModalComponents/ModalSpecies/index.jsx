import { useState, useEffect, useRef } from 'react';
import styles from './ModalSpecies.module.scss';
import categoryApi from '../../../apis/admin/categoryApi';

const ModalSpecies = ({ setIsShow, selectedItem, updateItem }) => {
    const modalRef = useRef(null);

    // State lưu danh sách danh mục
    const [categories, setCategories] = useState([]);

    // State lưu dữ liệu form đang sửa
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        categoryId: '',
    });

    // 1. Fetch Categories & Set Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh mục
                const res = await categoryApi.getAllCategory();
                setCategories(res.data.data);
            } catch (error) {
                console.error('Lỗi lấy danh mục:', error);
            }
        };
        fetchData();

        // Fill dữ liệu từ selectedItem vào form
        if (selectedItem) {
            setFormData({
                id: selectedItem.id,
                name: selectedItem.name || '',
                categoryId: selectedItem.categoryId || '', // Cần đảm bảo selectedItem có field này
            });
        }
    }, [selectedItem]);

    // 2. Xử lý lưu
    const handleSave = () => {
        if (!formData.name.trim()) {
            alert('Tên loài không được để trống!');
            return;
        }

        // Tạo object cập nhật (cần khớp với logic ở component cha)
        const updatedSpecies = {
            speciesId: formData.id, // ID loài
            editedName: formData.name, // Tên mới
            categoryId: formData.categoryId, // ID danh mục mới
        };

        updateItem(updatedSpecies);
        // setIsShow(false); // Thường đóng ở cha hoặc sau khi update thành công
    };

    return (
        <div
            className={`${styles['modal-overlay']} ${styles.show}`}
            onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) {
                    setIsShow(false);
                }
            }}
        >
            <div className={styles['modal']} ref={modalRef}>
                {/* --- Header --- */}
                <div className={styles['modal-header']}>
                    <h2>Chỉnh sửa Loài</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body --- */}
                <div className={styles['modal-body']}>
                    {/* ID (Read-only) */}
                    <div className={styles['form-group']}>
                        <label>Mã loài</label>
                        <input
                            type="text"
                            value={formData.id}
                            disabled
                            className={`${styles['custom-input']} ${styles['disabled']}`}
                        />
                    </div>

                    {/* Danh mục */}
                    <div className={styles['form-group']}>
                        <label htmlFor="categories">Thuộc danh mục</label>
                        <select
                            id="categories"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className={styles['custom-select']}
                        >
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tên loài */}
                    <div className={styles['form-group']}>
                        <label htmlFor="name">
                            Tên loài <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles['custom-input']}
                        />
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className={styles['modal-footer']}>
                    <button className={styles['btn-cancel']} onClick={() => setIsShow(false)}>
                        Hủy bỏ
                    </button>
                    <button className={styles['btn-save']} onClick={handleSave}>
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSpecies;
