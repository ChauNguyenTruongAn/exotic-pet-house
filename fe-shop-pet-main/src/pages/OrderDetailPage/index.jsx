import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './OrderDetailPage.module.scss';
import { FaArrowLeft } from 'react-icons/fa';
import orderApis from '../../apis/orderApis';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            console.log(id);
            try {
                const res = await orderApis.getMyOrder(id);
                setOrder(res.data.data);
                console.log(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className={styles.loading}>Đang tải đơn hàng...</div>;
    if (!order) return <div className={styles.error}>Không tìm thấy đơn hàng</div>;

    const totalItems = order.details.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Quay lại
            </button>

            <h2 className={styles.title}>Chi tiết đơn hàng #{id}</h2>

            <div className={styles.orderInfo}>
                <p>
                    <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}
                </p>
                <p>
                    <strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫
                </p>
                <p>
                    <strong>Trạng thái:</strong> <span className={styles.status}>{order.status}</span>
                </p>
                {order.note && (
                    <p>
                        <strong>Ghi chú:</strong> {order.note}
                    </p>
                )}
            </div>

            <h3 className={styles.subtitle}>Sản phẩm trong đơn ({totalItems})</h3>
            <div className={styles.productList}>
                {order.details.map((item) => (
                    <div key={item.productId} className={styles.productItem}>
                        <div className={styles.productImage}>
                            <img src={item.imageUrl || '/default-product.png'} alt={item.productName} />
                        </div>
                        <div className={styles.productInfo}>
                            <h4>{item.productName}</h4>
                            <p>Giá: {item.unitPrice.toLocaleString()}₫</p>
                            <p>Số lượng: {item.quantity}</p>
                            <p>Thành tiền: {item.lineTotal.toLocaleString()}₫</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetailPage;
