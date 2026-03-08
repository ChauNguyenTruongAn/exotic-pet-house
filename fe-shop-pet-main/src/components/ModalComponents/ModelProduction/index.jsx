import { useState, useEffect, useRef } from 'react';
import styles from './ModalPromotion.module.scss';

const ModalPromotion = ({ isShow, setIsShow, selectedItem, updateItem }) => {
    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        code: '',
        name: '',
        type: 'PERCENTAGE',
        value: 0,
        minimumOrder: 0,
        maxDiscount: 0,
        startDate: '',
        endDate: '',
        maxUsage: 0,
        status: 'ACTIVE',
    });

    // Helper: Convert ISO string -> YYYY-MM-DDTHH:mm (Local Time)
    const formatForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    useEffect(() => {
        if (selectedItem) {
            setFormData({
                id: selectedItem.id,
                code: selectedItem.code || '',
                name: selectedItem.name || '',
                type: selectedItem.type || 'PERCENTAGE',
                value: selectedItem.value || 0,
                minimumOrder: selectedItem.minimumOrder || 0,
                maxDiscount: selectedItem.maxDiscount || 0,
                startDate: formatForInput(selectedItem.startDate),
                endDate: formatForInput(selectedItem.endDate),
                maxUsage: selectedItem.maxUsage || 0,
                status: selectedItem.status || 'ACTIVE',
            });
        }
    }, [selectedItem]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        // Các trường số cần ép kiểu
        const numberFields = ['value', 'minimumOrder', 'maxDiscount', 'maxUsage'];
        setFormData((prev) => ({
            ...prev,
            [id]: numberFields.includes(id) ? Number(value) : value,
        }));
    };

    const handleSave = () => {
        // Validate cơ bản
        if (!formData.code.trim() || !formData.name.trim()) {
            alert('Vui lòng nhập Mã và Tên chương trình!');
            return;
        }
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu!');
            return;
        }

        const updatedItem = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        };

        updateItem(updatedItem);
        // setIsShow(false);
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
                <div className={styles['modal-header']}>
                    <h2>Cập nhật chương trình khuyến mãi</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                <div className={styles['modal-body']}>
                    {/* Phần 1: Thông tin chung */}
                    <div className={styles['section-title']}>Thông tin cơ bản</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="code">Mã Code (Voucher)</label>
                            <input
                                id="code"
                                type="text"
                                className={`${styles['custom-input']} ${styles['code-input']}`}
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles['form-group']} style={{ flex: 2 }}>
                            <label htmlFor="name">Tên chương trình</label>
                            <input
                                id="name"
                                type="text"
                                className={styles['custom-input']}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Phần 2: Giá trị & Điều kiện */}
                    <div className={styles['section-title']}>Thiết lập giá trị</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="type">Loại giảm giá</label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={styles['custom-select']}
                            >
                                <option value="PERCENTAGE">Theo phần trăm (%)</option>
                                <option value="FIXED_AMOUNT">Số tiền cố định (VND)</option>
                            </select>
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="value">Giá trị giảm</label>
                            <input
                                id="value"
                                type="number"
                                min="0"
                                className={styles['custom-input']}
                                value={formData.value}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="minimumOrder">Đơn tối thiểu</label>
                            <input
                                id="minimumOrder"
                                type="number"
                                min="0"
                                className={styles['custom-input']}
                                value={formData.minimumOrder}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="maxDiscount">Giảm tối đa (Cho %)</label>
                            <input
                                id="maxDiscount"
                                type="number"
                                min="0"
                                className={`${styles['custom-input']} ${formData.type === 'FIXED_AMOUNT' ? styles['disabled'] : ''}`}
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                disabled={formData.type === 'FIXED_AMOUNT'}
                            />
                        </div>
                    </div>

                    {/* Phần 3: Thời gian & Giới hạn */}
                    <div className={styles['section-title']}>Thời gian & Trạng thái</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="startDate">Bắt đầu</label>
                            <input
                                id="startDate"
                                type="datetime-local"
                                className={styles['custom-input']}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="endDate">Kết thúc</label>
                            <input
                                id="endDate"
                                type="datetime-local"
                                className={styles['custom-input']}
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="maxUsage">Lượt dùng tối đa</label>
                            <input
                                id="maxUsage"
                                type="number"
                                min="1"
                                className={styles['custom-input']}
                                value={formData.maxUsage}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="status">Trạng thái</label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles['custom-select']}
                            >
                                <option value="ACTIVE">Đang hoạt động</option>
                                <option value="INACTIVE">Tạm dừng / Vô hiệu</option>
                            </select>
                        </div>
                    </div>
                </div>

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

export default ModalPromotion;
