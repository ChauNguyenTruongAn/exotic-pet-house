import { useState, useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

const Modal = ({ setIsShow, selectedItem, setSelectedItem, updateItem }) => {
    const modalRef = useRef(null);
    const [editedName, setEditedName] = useState(selectedItem?.name || '');

    useEffect(() => {
        if (selectedItem) {
            setEditedName(selectedItem.name);
        }
    }, [selectedItem]);

    const handleSave = () => {
        if (editedName.trim() !== selectedItem.name) {
            const updatedItem = { ...selectedItem, name: editedName };
            updateItem(updatedItem);
        }
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
                <h2>Sửa thông tin danh mục</h2>
                <div>
                    <p>Mã danh mục: {selectedItem?.id ?? 'N/A'}</p>
                    <div>
                        <label htmlFor="name">Tên danh mục:</label>
                        <input
                            id="name"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)} // Cập nhật giá trị khi nhập
                        />
                    </div>
                </div>
                <div className={styles['modal-footer']}>
                    <button onClick={handleSave}>Lưu</button>
                    <button onClick={() => setIsShow(false)}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
