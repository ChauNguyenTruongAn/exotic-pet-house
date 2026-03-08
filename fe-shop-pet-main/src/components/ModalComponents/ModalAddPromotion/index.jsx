import { useState, useRef, useEffect } from 'react';
import styles from './ModalAddPromotion.module.scss';

const ModalAddPromotion = ({ isShow, setIsShow, addItem }) => {
    const modalRef = useRef(null);

    // Helper: Lấy thời gian hiện tại chuẩn định dạng input datetime-local
    const getNowISO = (addDays = 0) => {
        const date = new Date();
        date.setDate(date.getDate() + addDays);
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        type: 'PERCENT',
        value: 0,
        minimumOrder: 0,
        maxDiscount: 0,
        startDate: getNowISO(0), // Mặc định là hôm nay
        endDate: getNowISO(7), // Mặc định là 7 ngày sau
        maxUsage: 100,
        status: 'ACTIVE',
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (isShow) {
            setFormData({
                code: '',
                name: '',
                type: 'PERCENT',
                value: 0,
                minimumOrder: 0,
                maxDiscount: 0,
                startDate: getNowISO(0),
                endDate: getNowISO(7),
                maxUsage: 100,
                status: 'ACTIVE',
            });
        }
    }, [isShow]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const numberFields = ['value', 'minimumOrder', 'maxDiscount', 'maxUsage'];
        setFormData((prev) => ({
            ...prev,
            [id]: numberFields.includes(id) ? Number(value) : value,
        }));
    };

    const handleSave = () => {
        // Validate
        if (!formData.code.trim() || !formData.name.trim()) {
            alert('Vui lòng nhập Mã và Tên chương trình!');
            return;
        }
        if (formData.value <= 0) {
            alert('Giá trị giảm phải lớn hơn 0');
            return;
        }
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu!');
            return;
        }

        // Prepare Payload
        const newItem = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        };

        addItem(newItem);
        // setIsShow(false); // Đóng ở cha hoặc tại đây
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
                    <h2>Tạo khuyến mãi mới</h2>
                    <button className={styles['close-btn']} onClick={() => setIsShow(false)}>
                        &times;
                    </button>
                </div>

                <div className={styles['modal-body']}>
                    {/* Hàng 1 */}
                    <div className={styles['section-title']}>Thông tin cơ bản</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="code">
                                Mã Code <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="code"
                                type="text"
                                className={`${styles['custom-input']} ${styles['code-input']}`}
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="VD: SALE2025"
                            />
                        </div>
                        <div className={styles['form-group']} style={{ flex: 2 }}>
                            <label htmlFor="name">
                                Tên chương trình <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                className={styles['custom-input']}
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="VD: Khuyến mãi mùa hè..."
                            />
                        </div>
                    </div>

                    {/* Hàng 2 */}
                    <div className={styles['section-title']}>Giá trị</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="type">Loại giảm giá</label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={styles['custom-select']}
                            >
                                <option value="PERCENT">Phần trăm (%)</option>
                                <option value="AMOUNT">Số tiền cố định (VND)</option>
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

                    {/* Hàng 3 */}
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
                                className={`${styles['custom-input']} ${formData.type === 'AMOUNT' ? styles['disabled'] : ''}`}
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                disabled={formData.type === 'AMOUNT'}
                            />
                        </div>
                    </div>

                    {/* Hàng 4 */}
                    <div className={styles['section-title']}>Thời gian & Giới hạn</div>
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="startDate">Ngày bắt đầu</label>
                            <input
                                id="startDate"
                                type="datetime-local"
                                className={styles['custom-input']}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="endDate">Ngày kết thúc</label>
                            <input
                                id="endDate"
                                type="datetime-local"
                                className={styles['custom-input']}
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Hàng 5 */}
                    <div className={styles['row-group']}>
                        <div className={styles['form-group']}>
                            <label htmlFor="maxUsage">Tổng lượt dùng tối đa</label>
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
                            <label htmlFor="status">Trạng thái ban đầu</label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles['custom-select']}
                            >
                                <option value="ACTIVE">Kích hoạt ngay</option>
                                <option value="INACTIVE">Chưa kích hoạt</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    <button className={styles['btn-cancel']} onClick={() => setIsShow(false)}>
                        Hủy bỏ
                    </button>
                    <button className={styles['btn-save']} onClick={handleSave}>
                        Tạo khuyến mãi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddPromotion;
