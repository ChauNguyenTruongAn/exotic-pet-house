import { useNavigate } from 'react-router-dom';

import styles from './ProductGrid.module.scss';
import { useCart } from '../../context/cart';
import { toast } from 'react-toastify';

export default function ProductGrid({ products }) {
    const navigate = useNavigate();
    const { cart, addProductToCart } = useCart();

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addProductToCart(product);
    };

    const handleDetail = (e, product) => {
        e.stopPropagation();
        showDetail(product);
    };

    const handleClickCard = (p) => {
        console.log('hello ' + p.id + ' -- ' + p.name);
        showDetail(p);
    };

    const showDetail = (p) => {
        // xử lý chuyển trang ở đây
        navigate(`/product/${p.id}`);
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['grid']}>
                {products.map((p) => (
                    <div key={p.id} className={styles['card']} onClick={() => handleClickCard(p)}>
                        <img src={p.imageLink} alt={p.name} className={styles['image']} />
                        <h3 className={styles['name']}>{p.name}</h3>
                        <p className={styles['price']}>{p.price.toLocaleString('vi-VN')}₫</p>

                        <div className={styles['action']}>
                            <div className={styles['wrapper-action']}>
                                <button className={styles['action-button']} onClick={(e) => handleAddToCart(e, p)}>
                                    <i class="fa-solid fa-basket-shopping"></i>
                                </button>
                                <button className={styles['action-button']} onClick={(e) => handleDetail(e, p)}>
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
