import { useState, useEffect, useRef } from 'react';
import styles from './ModalOrder.module.scss'; // Nhớ tạo file scss

const ModalOrder = ({ isShow, setIsShow, selectedItem, updateItem }) => {
    const modalRef = useRef(null);

    const [status, setStatus] = useState('PENDING');
    const [note, setNote] = useState('');

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleString('vi-VN');
    };

    useEffect(() => {
        if (selectedItem) {
            setStatus(selectedItem.status || 'PENDING');
            setNote(selectedItem.note || '');
        }
    }, [selectedItem]);

    const handleSave = () => {
        const updatedItem = {
            ...selectedItem,
            status: status,
            note: note,
        };

        console.log(updatedItem);
        updateItem(updatedItem);
        setIsShow(false);
    };

    const subTotal = selectedItem?.details?.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0) || 0;

    return (
        <div
            className={`${styles['modal-overlay']} ${isShow ? styles.show : ''}`}
            onClick={(e) => {
                if (modalRef.current && !modalRef.current.contains(e.target)) setIsShow(false);
            }}
        >
            <div className={styles['modal']} ref={modalRef}>
                <div className={styles['modal-header']}>
                    <h2>Chi tiết đơn hàng #{selectedItem?.orderId}</h2>
                    <span className={styles['date']}>Ngày đặt: {formatDate(selectedItem?.orderDate)}</span>
                </div>

                <div className={styles['modal-body']}>
                    <div className={styles['section']}>
                        <h3>Thông tin khách hàng</h3>
                        <div className={styles['info-grid']}>
                            <p>
                                <strong>Khách hàng:</strong> {selectedItem?.customer?.fullName}
                            </p>
                            <p>
                                <strong>SĐT:</strong> {selectedItem?.customer?.phone}
                            </p>
                            <p>
                                <strong>Địa chỉ:</strong> {selectedItem?.customer?.address || 'Tại cửa hàng'}
                            </p>
                        </div>
                    </div>

                    <div className={styles['section']}>
                        <h3>Sản phẩm đã mua</h3>
                        <div className={styles['order-items-table']}>
                            <div className={styles['items-header']}>
                                <span>Sản phẩm</span>
                                <span className="text-center">SL</span>
                                <span className="text-right">Đơn giá</span>
                                <span className="text-right">Thành tiền</span>
                            </div>
                            <div className={styles['items-body']}>
                                {selectedItem?.details?.map((item, index) => (
                                    <div key={index} className={styles['item-row']}>
                                        <span>{item.productName}</span>
                                        <span className="text-center">x{item.quantity}</span>
                                        <span className="text-right">{formatCurrency(item.unitPrice)}</span>
                                        <span className="text-right">
                                            {formatCurrency(item.unitPrice * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles['financial-summary']}>
                        <div className={styles['summary-row']}>
                            <span>Tạm tính:</span>
                            <span>{formatCurrency(subTotal)}</span>
                        </div>
                        <div className={styles['summary-row']}>
                            <span>Khuyến mãi ({selectedItem?.promotion?.code || 'Không'}):</span>
                            <span className={styles['discount']}>-{formatCurrency(selectedItem?.discountAmount)}</span>
                        </div>
                        <div className={`${styles['summary-row']} ${styles['total']}`}>
                            <span>Tổng thanh toán:</span>
                            <span>{formatCurrency(selectedItem?.totalPrice)}</span>
                        </div>
                    </div>

                    <div className={styles['section']} style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <h3>Cập nhật trạng thái</h3>
                        <div className={styles['form-control']}>
                            <label>Trạng thái đơn hàng:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={styles['select-status']}
                            >
                                <option value="PENDING">Chờ xử lý (Pending)</option>
                                <option value="CONFIRMED">Đã xác nhận (Confirmed)</option>
                                <option value="SHIPPED">Đang giao hàng (Shipping)</option>
                                <option value="COMPLETED">Hoàn thành (Completed)</option>
                                <option value="CANCELLED">Đã hủy (Cancelled)</option>
                            </select>
                        </div>
                        <div className={styles['form-control']}>
                            <label>Ghi chú Admin:</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú nội bộ..."
                            />
                        </div>
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    <button className={styles['btn-save']} onClick={handleSave}>
                        Cập nhật đơn hàng
                    </button>
                    <button className={styles['btn-close']} onClick={() => setIsShow(false)}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalOrder;
