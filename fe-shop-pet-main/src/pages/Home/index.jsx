import styles from './Home.module.scss';

import HeroSlider from '../../components/HeroSlider';
import ExoticSection from '../../components/ExoticSection';

import so17 from '@/assets/images/so17.jpg';
import so18 from '@/assets/images/so18.jpg';
import so19 from '@/assets/images/so19.jpg';
import so20 from '@/assets/images/so20.jpg';
import so21 from '@/assets/images/so21.jpg';
import { useEffect, useState } from 'react';
import productApi from '../../apis/productApis';
import { useCart } from '../../context/cart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const productData = [
    { id: 17, image: so17, name: 'Green Iguana' },
    { id: 18, image: so18, name: 'Fire Skink' },
    { id: 19, image: so19, name: 'Millipede' },
    { id: 20, image: so20, name: 'Turtle Baby' },
    { id: 21, image: so21, name: 'Snake Morph' },
];

export const Home = () => {
    const [data, setData] = useState([]);

    const { cart, addProductToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addProductToCart(product);
    };

    const handleDetail = (e, product) => {
        e.stopPropagation();
        showDetail(product);
    };

    const handleClickCard = (p) => {
        showDetail(p);
    };

    const showDetail = (p) => {
        navigate(`/product/${p.id}`);
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await productApi.get3LatestProduct();
                setData(response.data.data);
            } catch (error) {
                console.error('Lỗi tải dữ liệu');
            }
        };
        fetch();
    }, []);

    return (
        <div className={styles.wrapper}>
            <HeroSlider />

            {/* SẢN PHẨM NỔI BẬT */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2> Sản phẩm nổi bật</h2>
                    <p>Những sản phẩm mới nhất vừa về</p>
                </div>

                <div className={styles.productGrid}>
                    {data.map((product) => (
                        <div key={product.id} className={styles.productCard} onClick={() => handleClickCard(product)}>
                            <div className={styles.imageWrapper}>
                                <img src={product.imageLink} alt={product.name} />
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.name}>{product.name}</h3>
                                <p className={styles.price}>{product.price.toLocaleString('vi-VN')}₫</p>

                                <div className={styles.actions}>
                                    <button className={styles.cartBtn} onClick={(e) => handleAddToCart(e, product)}>
                                        Thêm
                                    </button>
                                    <button className={styles.detailBtn} onClick={(e) => handleDetail(e, product)}>
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* EXOTIC
            <section className={`${styles.section} ${styles.exotic}`}>
                <ExoticSection title="SIÊU THÚ" products={productData} />
            </section> */}
        </div>
    );
};
