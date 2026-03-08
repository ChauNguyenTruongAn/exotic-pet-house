import { useNavigate } from 'react-router-dom';
import CartItem from '../../components/CartItem';
import { useCart } from '../../context/cart';
import Breadcrumb from '../../layouts/components/Breadcrumb';
import styles from './Cart.module.scss';
import { ROUTES } from '../../configs/routes';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { useEffect } from 'react';

const Cart = () => {
    const { cart, removeProductFromCart, decreaseItem, increaseItem, updateProductFromCart } = useCart();
    const navigate = useNavigate();

    const formatCurrency = (amount) => (amount ? amount.toLocaleString('vi-VN') + ' đ' : '0 đ');

    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const { user, loading } = useAuth();

    const handlePayment = () => {
        if (user == null) {
            toast.error('Vui lòng đăng nhập');
            navigate('/login');
        }

        if (cart.length <= 0 || cart == null || cart == undefined || cart == '') {
            toast.error('Giỏ hàng trống không thể thanh toán!');
        } else {
            navigate(ROUTES.payment);
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        }

        if (user == null) {
            toast.error('Vui lòng đăng nhập');
            navigate('/login');
        }
    }, [user, loading]);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.breadcrumb}>
                <Breadcrumb breadcrumb={['Trang chủ', 'Giỏ hàng']} />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    GIỎ HÀNG <span>({cart.length} sản phẩm)</span>
                </div>

                <div className={styles.cart}>
                    <div className={styles.products}>
                        {cart.length === 0 ? (
                            <div className={styles.emptyCart}>
                                <div className={styles.emptyIcon}>
                                    <i class="fa-solid fa-basket-shopping"></i>
                                </div>
                                <h3>Giỏ hàng của bạn đang trống</h3>
                                <p>Hãy thêm sản phẩm để tiếp tục mua sắm nhé!</p>
                                <button className={styles.shopBtn} onClick={() => navigate('/product')}>
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <CartItem
                                    key={item.id}
                                    quantity={item.quantity}
                                    product={item.product}
                                    removeProductFromCart={removeProductFromCart}
                                    updateProductFromCart={updateProductFromCart}
                                    increaseItem={increaseItem}
                                    decreaseItem={decreaseItem}
                                />
                            ))
                        )}
                    </div>

                    <div className={styles.total}>
                        <div>
                            <span>Tạm tính</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>

                        <div>
                            <span>Thành tiền</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>

                        <button onClick={handlePayment}>Thanh toán ngay</button>
                        <button onClick={() => navigate(ROUTES.product)}>Tiếp tục mua hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
