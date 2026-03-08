import React, { useEffect, useState } from 'react';
import styles from './OrderHistory.module.scss';
import orderApis from '../../apis/orderApis';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderApis.getAllOrder();
            setOrders(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    const goDetail = (id) => navigate(`/orders/${id}`);

    /** ============================
     *  HANDLE CANCEL ORDER
     *  ============================ */
    const handleCancel = async (orderId) => {
        const confirmCancel = window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?');
        if (!confirmCancel) return;

        try {
            const res = await orderApis.cancelOrder(orderId);
            alert('Hủy đơn thành công!');
            fetchOrders(); // refresh UI sau khi hủy
        } catch (error) {
            console.error(error);
            alert('Không thể hủy đơn hàng, vui lòng thử lại!');
        }
    };

    /** Kiểm tra xem có thể hủy hay không */
    const canCancel = (status) => {
        return ['PENDING', 'CHỜ XÁC NHẬN'].includes(status.toUpperCase());
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Lịch sử mua hàng</h1>

            {orders.length === 0 ? (
                <div className={styles.empty}>
                    <img src="/empty-box.png" alt="no orders" />
                    <p>Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {orders.map((order) => (
                        <div key={order.orderId} className={styles.orderCard}>
                            {/* Header */}
                            <div className={styles.orderHeader}>
                                <div>
                                    <span className={styles.orderId}>#{order.orderId}</span>
                                    <span className={styles.orderDate}>
                                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Product List */}
                            <div className={styles.products}>
                                {order.details.map((item) => (
                                    <div className={styles.productItem} key={item.productId}>
                                        <img src={item.imageUrl} alt={item.productName} />
                                        <div className={styles.productInfo}>
                                            <p className={styles.productName}>{item.productName}</p>
                                            <p className={styles.quantity}>x{item.quantity}</p>
                                        </div>
                                        <p className={styles.price}>{formatCurrency(item.unitPrice)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className={styles.orderFooter}>
                                <p className={styles.total}>
                                    Tổng tiền: <span>{formatCurrency(order.totalPrice)}</span>
                                </p>

                                <div className={styles.actions}>
                                    <button className={styles.detailBtn} onClick={() => goDetail(order.orderId)}>
                                        Xem chi tiết <FaArrowRight />
                                    </button>

                                    {canCancel(order.status) && (
                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() => handleCancel(order.orderId)}
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
