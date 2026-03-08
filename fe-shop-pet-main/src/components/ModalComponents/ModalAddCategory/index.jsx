import { useRef, useState } from 'react';
import styles from './ModalAddCategory.module.scss';

const ModalAddCategory = ({ setIsShow, addItem }) => {
    const modalRef = useRef(null);
    const [category, setNewCategory] = useState('');

    const handleAddItem = () => {
        const item = {
            name: category,
        };

        addItem(item);
        setIsShow(false);
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
                <h2>Thêm danh mục</h2>
                <div>
                    <div>
                        <label htmlFor="name">Tên danh mục:</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nhập tên danh mục mới"
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles['modal-footer']}>
                    <button onClick={handleAddItem}>Lưu</button>
                    <button onClick={() => setIsShow(false)}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddCategory;
