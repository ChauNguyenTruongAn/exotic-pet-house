import { useEffect, useRef, useState } from 'react';
import styles from './ModalAddSpecies.module.scss';
import categoryApi from '../../../apis/admin/categoryApi';

const ModalAppSpecies = ({ setIsShow, addItem }) => {
    const modalRef = useRef(null);

    // State
    const [name, setName] = useState(''); // Tên loài
    const [categories, setCategories] = useState([]); // Danh sách danh mục
    const [selectedCategoryId, setSelectedCategoryId] = useState(''); // ID danh mục được chọn

    // 1. Load danh sách danh mục khi mở modal
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAllCategory();
                const list = response.data.data;
                setCategories(list);

                // Tự động chọn danh mục đầu tiên nếu có dữ liệu
                if (list && list.length > 0) {
                    setSelectedCategoryId(list[0].id);
                }
            } catch (error) {
                console.error('Lỗi lấy danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Xử lý lưu
    const handleSave = () => {
        if (!name.trim()) {
            alert('Vui lòng nhập tên loài!');
            return;
        }

        // Tạo object gửi đi (Cần khớp với API của bạn: categoryId hay id?)
        const newItem = {
            name: name,
            categoryId: selectedCategoryId, // Gửi ID danh mục cha
            // id: selectedCategoryId // (Code cũ của bạn dùng key này, hãy kiểm tra lại API cần key nào nhé)
        };

        addItem(newItem);
        // setIsShow(false); // Thường thì hàm addItem xong sẽ đóng, hoặc đóng ở đây tùy logic cha
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
                    <h2>Thêm mới Loài</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body --- */}
                <div className={styles['modal-body']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="categories">
                            Thuộc danh mục <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                            id="categories"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className={styles['custom-select']}
                        >
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="name">
                            Tên loài <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Rùa, Rắn, Ếch..."
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
                        Lưu lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAppSpecies;
