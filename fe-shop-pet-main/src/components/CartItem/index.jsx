import styles from './CartItem.module.scss';

const CartItem = ({ product, quantity, removeProductFromCart, increaseItem, decreaseItem, updateProductFromCart }) => {
    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['image']}>
                <img
                    src={product?.imageLink || 'https://placehold.co/250x250?text=No+Image'}
                    alt={product?.name || 'no-image'}
                />
            </div>

            <div className={styles['description']}>
                <div className={styles['name']}>{product?.name}</div>

                <div className={styles['price']}>{formatCurrency(product?.price)}</div>
            </div>
            <div className={styles['wrapper-control']}>
                <div className={styles['control']}>
                    <button onClick={() => decreaseItem(product.id)} disabled={quantity <= 1}>
                        {' '}
                        -{' '}
                    </button>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => updateProductFromCart(product.id, Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={() => increaseItem(product.id)}> + </button>
                </div>
                <div className={styles['remove']} onClick={() => removeProductFromCart(product.id)}>
                    Xóa
                </div>
            </div>
        </div>
    );
};

export default CartItem;
