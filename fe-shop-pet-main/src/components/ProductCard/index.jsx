import styles from './ProductCard.module.scss';

export default function ProductCard({ product, handleClickCard, handleDetail, handleAddToCart }) {
    return (
        <div key={product?.id} className={styles['card']} onClick={() => handleClickCard(product)}>
            <img src={product?.imageLink} alt={product?.name} className={styles['image']} />
            <h3 className={styles['name']}>{product?.name}</h3>
            <p className={styles['price']}>{product?.price.toLocaleString('vi-VN')}₫</p>

            <div className={styles['action']}>
                <div className={styles['wrapper-action']}>
                    <button className={styles['action-button']} onClick={(e) => handleAddToCart(e, product)}>
                        Cart
                    </button>
                    <button className={styles['action-button']} onClick={(e) => handleDetail(e, product)}>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}
