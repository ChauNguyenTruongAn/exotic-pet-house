import { useNavigate, useParams } from 'react-router-dom';
import styles from './ProductDetail.module.scss';
import { useEffect, useState } from 'react';
import productApi from '../../apis/productApis';
import ProductCard from '../../components/ProductCard';
import AdsItem from '../../components/AdsItem';
import ProductButton from '../../components/ProductButton';
import { useCart } from '../../context/cart';
import Breadcrumb from '../../layouts/components/Breadcrumb';
import Rating from '../../components/Rating';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [productRelated, setProductRelated] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [productQuantity, setProductQuantity] = useState(1);

    const navigate = useNavigate();
    const { addProductToCart } = useCart();

    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productResponse = await productApi.getProductById(id);
                const productData = productResponse.data.data;
                setProduct(productData);

                if (productData?.speciesId) {
                    const productRelatedResponse = await productApi.getProductRelatedById(productData.speciesId);
                    const relatedData = productRelatedResponse.data.data;
                    // Lọc bỏ sản phẩm hiện tại khỏi danh sách sản phẩm liên quan
                    setProductRelated(relatedData.filter((item) => item.id !== id));
                }
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        // Reset về trang đầu tiên khi chuyển sản phẩm
        setPage(0);
        setProductQuantity(1);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const nextPage = () => {
        if (productRelated && page < Math.ceil(productRelated.length / ITEMS_PER_PAGE) - 1) {
            setPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    const increaseProduct = () => {
        setProductQuantity((prev) => prev + 1);
    };

    const decreaseProduct = () => {
        if (productQuantity > 1) {
            setProductQuantity((prev) => prev - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value >= 1) {
            setProductQuantity(value);
        }
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    const handleAddToCart = (e, productToAdd) => {
        e?.stopPropagation();
        addProductToCart(product, productQuantity);
        toast.success(`Đã thêm ${productQuantity} "${product.name}" vào giỏ hàng`);
    };

    const handleBuyNow = () => {
        if (product) {
            addProductToCart({ ...product, quantity: productQuantity });
            navigate('/cart');
        }
    };

    const handleClickCard = (p) => {
        navigate(`/product/${p.id}`);
    };

    if (loading) {
        return (
            <div className={styles['wrapper']}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#c4300d' }}></i>
                    <p style={{ marginTop: '20px', color: '#666' }}>Đang tải sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles['wrapper']}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <i className="fa-solid fa-exclamation-circle" style={{ fontSize: '48px', color: '#999' }}></i>
                    <p style={{ marginTop: '20px', color: '#666' }}>Không tìm thấy sản phẩm</p>
                </div>
            </div>
        );
    }

    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedProducts = productRelated?.slice(startIndex, endIndex) || [];

    return (
        <div className={styles['wrapper']}>
            <Breadcrumb
                breadcrumb={['Trang chủ', 'Sản phẩm', product.categoryName, product.speciesName, product.name]}
            />

            <hr />

            <div className={styles['content']}>
                <div className={styles['product-name']}>{product.name}</div>

                <div className={styles['product-header']}>
                    <div className={styles['product-id']}>
                        <span className={styles['product-id-header']}>Mã sản phẩm:</span>
                        <span>{product.id || 'Đang cập nhật...'}</span>
                    </div>
                    <div className={styles['product-rating']}>
                        <span>Đánh giá:</span>
                        <Rating rating={product.rating || 4.3} />
                    </div>
                </div>

                <hr />

                <div className={styles['product-content']}>
                    <div className={styles['product-image']}>
                        <img src={product.imageLink} alt={product.name} />
                    </div>

                    <div className={styles['product-price']}>
                        <div className={styles['price-wrapper']}>
                            <div className={styles['price-amount']}>{formatCurrency(product.price)}</div>
                            <div className={styles['price-label']}>Giá đã bao gồm VAT</div>
                        </div>

                        <div className={styles['product-status']}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#30a43b' }}></i>
                            <strong>Tình trạng:</strong>
                            <span>Còn hàng</span>
                        </div>

                        <div className={styles['product-quantity']}>
                            <span className={styles['product-quantity-name']}>Số lượng</span>
                            <div className={styles['product-cart']}>
                                <button onClick={decreaseProduct} disabled={productQuantity <= 1}>
                                    <i className="fa-solid fa-minus"></i>
                                </button>
                                <input type="number" value={productQuantity} onChange={handleQuantityChange} min="1" />
                                <button onClick={increaseProduct}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className={styles['product-button']}>
                            <ProductButton
                                icon={<i className="fa-solid fa-cart-arrow-down"></i>}
                                name="THÊM VÀO GIỎ"
                                onClick={handleAddToCart}
                            />
                            <ProductButton name="MUA NGAY" onClick={handleBuyNow} />
                        </div>

                        <div className={styles['product-contact']}>
                            <i className="fa-solid fa-phone"></i>
                            Gọi điện để được tư vấn miễn phí
                        </div>
                    </div>

                    <div className={styles['product-ads']}>
                        <AdsItem
                            name="MIỄN PHÍ VẬN CHUYỂN"
                            description="Cho đơn hàng > 5 triệu"
                            icon={<i className="fa-solid fa-truck-fast"></i>}
                        />
                        <div className={styles['dash']}></div>
                        <AdsItem
                            name="THANH TOÁN KHI NHẬN HÀNG"
                            description="Cho đơn hàng < 3 triệu"
                            icon={<i className="fa-solid fa-hand-holding-dollar"></i>}
                        />
                        <div className={styles['dash']}></div>
                        <AdsItem
                            name="MIỄN PHÍ PHỤ KIỆN ĐI KÈM"
                            description="Trang bị tận răng"
                            icon={<i className="fa-solid fa-gift"></i>}
                        />
                        <div className={styles['dash']}></div>
                        <AdsItem
                            name="BẢO HÀNH 1 ĐỔI 1"
                            description="Trong vòng 30 ngày"
                            icon={<i className="fa-solid fa-repeat"></i>}
                        />
                    </div>
                </div>

                <div className={styles['product-review']}>
                    <h2>Đánh giá sản phẩm</h2>
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Chức năng đánh giá đang được phát triển...</p>
                </div>

                <hr />

                {productRelated && productRelated.length > 0 && (
                    <div className={styles['product-related-section']}>
                        <h2>Sản phẩm liên quan</h2>

                        <div className={styles['product-related-page']}>
                            <button onClick={prevPage} disabled={page === 0}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button
                                onClick={nextPage}
                                disabled={page >= Math.ceil(productRelated.length / ITEMS_PER_PAGE) - 1}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className={styles['product-related']}>
                            {displayedProducts.map((item) => (
                                <ProductCard
                                    product={item}
                                    key={item.id}
                                    handleAddToCart={(e) => handleAddToCart(e, item)}
                                    handleDetail={(e) => {
                                        e.stopPropagation();
                                        handleClickCard(item);
                                    }}
                                    handleClickCard={() => handleClickCard(item)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
