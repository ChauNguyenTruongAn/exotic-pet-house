import { useState, useEffect, useRef } from 'react';
import styles from './ModalUser.module.scss';

const ModalUser = ({ isShow, setIsShow, selectedItem, updateItem }) => {
    const modalRef = useRef(null);

    // Gom nhóm state vào 1 object cho gọn
    const [formData, setFormData] = useState({
        id: '',
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        role: 'USER',
    });

    // Fill dữ liệu khi mở modal
    useEffect(() => {
        if (selectedItem) {
            setFormData({
                id: selectedItem.id,
                fullName: selectedItem.fullName || '',
                phoneNumber: selectedItem.phoneNumber || '',
                email: selectedItem.email || '',
                address: selectedItem.address || '',
                role: selectedItem.role || 'USER',
            });
        }
    }, [selectedItem]);

    // Xử lý thay đổi input chung
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        // Validate cơ bản
        if (!formData.fullName.trim()) {
            alert('Họ tên không được để trống!');
            return;
        }

        updateItem(formData);
        // setIsShow(false); // Thường đóng ở cha sau khi update xong
    };

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
                {/* --- Header --- */}
                <div className={styles['modal-header']}>
                    <h2>Chỉnh sửa người dùng</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                {/* --- Body --- */}
                <div className={styles['modal-body']}>
                    {/* Hàng 1: Họ tên + SĐT */}
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="fullName">
                                Họ và tên <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <input
                                id="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>
                    </div>

                    {/* Hàng 2: Email (Disabled) + Vai trò */}
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="email">Email (Định danh)</label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className={`${styles['custom-input']} ${styles['disabled']}`}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="role">Vai trò</label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={styles['custom-select']}
                            >
                                <option value="USER">Người dùng (User)</option>
                                <option value="ADMIN">Quản trị viên (Admin)</option>
                            </select>
                        </div>
                    </div>

                    {/* Hàng 3: Địa chỉ */}
                    <div className={styles['form-group']}>
                        <label htmlFor="address">Địa chỉ liên hệ</label>
                        <textarea
                            id="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            className={styles['custom-textarea']}
                        />
                    </div>
                </div>

                {/* --- Footer --- */}
                <div className={styles['modal-footer']}>
                    <button className={styles['btn-cancel']} onClick={() => setIsShow(false)}>
                        Hủy bỏ
                    </button>
                    <button className={styles['btn-save']} onClick={handleSave}>
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUser;
