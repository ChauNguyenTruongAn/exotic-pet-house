import { useState, useRef } from 'react';
import styles from './ModalAddUser.module.scss';

const ModalAddUser = ({ isShow, setIsShow, addItem }) => {
    const modalRef = useRef(null);

    // State quản lý form
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '', // Thêm trường password khi tạo mới
        address: '',
        role: 'USER',
    });

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        // Validate cơ bản
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
            alert('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!');
            return;
        }

        // Gọi hàm thêm mới từ cha
        addItem(formData);

        // Reset form sau khi thêm (tuỳ chọn)
        /* setFormData({
            fullName: '',
            phoneNumber: '',
            email: '',
            password: '',
            address: '',
            role: 'USER'
        }); */
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
                    <h2>Thêm người dùng mới</h2>
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
                                placeholder="Nguyễn Văn A"
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
                                placeholder="09xx..."
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>
                    </div>

                    {/* Hàng 2: Email + Mật khẩu */}
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="email">
                                Email đăng nhập <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="password">
                                Mật khẩu khởi tạo <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Nhập mật khẩu..."
                                value={formData.password}
                                onChange={handleChange}
                                className={styles['custom-input']}
                            />
                        </div>
                    </div>

                    {/* Hàng 3: Vai trò (Full width hoặc chia cột tùy ý) */}
                    <div className={styles['form-group']}>
                        <label htmlFor="role">Vai trò hệ thống</label>
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

                    {/* Hàng 4: Địa chỉ */}
                    <div className={styles['form-group']}>
                        <label htmlFor="address">Địa chỉ liên hệ</label>
                        <textarea
                            id="address"
                            rows="3"
                            placeholder="Số nhà, đường, phường/xã..."
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
                        Thêm mới
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddUser;
