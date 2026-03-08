import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderDropdown.module.scss';
import { FaArrowRight } from 'react-icons/fa';

const OrderDropdown = ({ orders }) => {
    const navigate = useNavigate();

    const handleGoOrderDetail = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    if (!orders || orders.length === 0) {
        return <div className={styles.dropdown}>Chưa có đơn hàng nào</div>;
    }

    return (
        <div className={styles.dropdown}>
            {orders.map((order) => (
                <div
                    key={order.orderId}
                    className={styles.orderItem}
                    onClick={() => handleGoOrderDetail(order.orderId)}
                >
                    <div className={styles.orderHeader}>
                        <span className={styles.orderId}>#{order.orderId}</span>
                        <span className={styles.orderDate}>
                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <div className={styles.orderProducts}>
                        {order.details.slice(0, 2).map((item) => (
                            <div key={item.productId} className={styles.productName}>
                                {item.productName} x{item.quantity}
                            </div>
                        ))}
                        {order.details.length > 2 && (
                            <div className={styles.moreItems}>+{order.details.length - 2} sản phẩm khác</div>
                        )}
                    </div>
                    <div className={styles.orderFooter}>
                        <span className={styles.total}>Tổng: {order.totalPrice.toLocaleString()}₫</span>
                        <span className={styles.status}>{order.status}</span>
                        <FaArrowRight className={styles.icon} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderDropdown;
