import styles from './Payment.module.scss';

import image from '../../assets/images/logo_1.png';
import geoApi from '../../apis/geoApi';
import { useCart } from '../../context/cart';
import promotionApis from '../../apis/promotionApis';
import { useLocation, useNavigate } from 'react-router-dom';
import loginApi from '../../apis/logApi';
import orderApis from '../../apis/orderApis';
import OrderSuccess from '../../components/OrderSuccess';
import OrderFailure from '../../components/OrderFailure';
import OrderError from '../../components/OrderError';
import { useEffect, useState } from 'react';

const InputForm = ({ type, value, placeholder, onChange }) => (
    <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
    />
);

const ChooseInput = ({ value, onChange, type }) => {
    const types = {
        1: 'Tỉnh/ Thành phố',
        2: 'Quận/ Huyện',
        3: 'Phường/ Xã',
    };

    return (
        <select className="form-select" onChange={onChange}>
            <option value={9999}>{types[type]}</option>
            {value?.map((item) => (
                <option key={item.code} value={item.code}>
                    {item.name}
                </option>
            ))}
        </select>
    );
};

const InputNote = ({ value, onChange }) => (
    <textarea
        className="form-control"
        placeholder="Ghi chú"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
    ></textarea>
);

const Payment = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [note, setNote] = useState('');

    const [selectedProvince, setSelectedProvince] = useState('9999');
    const [selectedDistrict, setSelectedDistrict] = useState('9999');
    const [selectedWard, setSelectedWard] = useState('9999');

    const [selectMethodShip, setSelectMethodShip] = useState('pickup');
    const [selectMethodPay, setSelectMethodPay] = useState('COD');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [promotion, setPromotion] = useState(null);
    const [promotionCode, setPromotionCode] = useState('');
    const [userInfo, setUserInfo] = useState();
    const [showPromotionSuggestions, setShowPromotionSuggestions] = useState(false);

    const [total, setTotal] = useState(0);
    const [temp, setTemp] = useState(0);

    const { cart, setCart, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [isShowNotificationSuccess, setIsShowNotificationSuccess] = useState(false);
    const [isShowNotificationFail, setIsShowNotificationFail] = useState(false);
    const [isShowNotificationError, setIsShowNotificationError] = useState(false);
    const [isShowNotificationExceedQuantity, setIsShowNotificationExceedQuantity] = useState(false);
    const [showAddressWarning, setShowAddressWarning] = useState(false);
    const [validationError, setValidationError] = useState('');

    // Danh sách mã khuyến mãi gợi ý
    const promotionSuggestions = [
        { code: 'NFSALE20', description: 'Giảm 20% đơn hàng' },
        { code: 'HOTDEAL30', description: 'Giảm 30% cho đơn hot' },
        { code: 'FREESHIP', description: 'Miễn phí vận chuyển' },
    ];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const txnRef = params.get('txnRef');
        const code = params.get('code');
        const error = params.get('error');

        if (code) {
            setIsShowNotificationFail(true);
            return;
        }

        if (error) {
            setIsShowNotificationError(true);
            return;
        }

        if (txnRef) {
            setIsShowNotificationSuccess(true);
            setCart([]);
        }
    }, []);

    useEffect(() => {
        const tempTotalCart = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotal(tempTotalCart);
        setTemp(tempTotalCart);
    }, [cart]);

    // Fetch Provinces
    useEffect(() => {
        geoApi.getProvince().then((res) => setProvinces(res.data.data));
    }, []);

    // Fetch Districts
    useEffect(() => {
        if (!selectedProvince || selectedProvince === '9999') {
            setDistricts([]);
            setSelectedDistrict('9999');
            return;
        }
        geoApi.getDistrict(selectedProvince).then((res) => setDistricts(res.data.data));
    }, [selectedProvince]);

    // Fetch Wards
    useEffect(() => {
        if (!selectedDistrict || selectedDistrict === '9999') {
            setWards([]);
            setSelectedWard('9999');
            return;
        }
        geoApi.getWards(selectedDistrict).then((res) => setWards(res.data.data));
    }, [selectedDistrict]);

    // Kiểm tra địa chỉ khi component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (selectedProvince === '9999' || selectedDistrict === '9999' || selectedWard === '9999') {
                setShowAddressWarning(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Ẩn cảnh báo khi đã chọn đủ địa chỉ
    useEffect(() => {
        if (selectedProvince !== '9999' && selectedDistrict !== '9999' && selectedWard !== '9999') {
            setShowAddressWarning(false);
        }
    }, [selectedProvince, selectedDistrict, selectedWard]);

    //get info
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken != null) {
            const fetch = async () => {
                try {
                    const response = await loginApi.me();
                    setUserInfo(response.data.data);

                    setEmail(response.data.data.email);
                    setName(response.data.data.fullName);
                    setPhone(response.data.data.phoneNumber);
                    setAddress(response.data.data.address);
                } catch (error) {}
            };

            fetch();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (cart.length === 0) return;

            const response = await orderApis.checkOrder(cart.map((i) => i.product.id));

            const products = response.data.data;

            const hasExceeded = cart.some((item) => {
                const product = products.find((p) => p.productId === item.product.id);
                if (!product) return false;
                const maxQuantity = product.quantityInventory < 0 ? 0 : product.quantityInventory;
                return item.quantity > maxQuantity;
            });

            setCart((prevCart) =>
                prevCart.map((item) => {
                    const product = products.find((p) => p.productId === item.product.id);

                    if (!product) return item;

                    const maxQuantity = product.quantityInventory < 0 ? 0 : product.quantityInventory;

                    return {
                        ...item,
                        quantity: item.quantity > maxQuantity ? maxQuantity : item.quantity,
                    };
                }),
            );

            if (hasExceeded) {
                setIsShowNotificationExceedQuantity(true);
            }
        };

        fetchData();
    }, []);

    const handleClick = (method) => {
        setSelectMethodPay(method);
    };

    const formatCurrency = (amount) => {
        return amount ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
    };

    const addPromotion = async (code) => {
        try {
            if (code == null || code.trim() === '') {
                setValidationError('Vui lòng nhập mã khuyến mãi');
                setTimeout(() => setValidationError(''), 3000);
                return;
            }

            if (promotion !== null) {
                setValidationError('Bạn đã áp dụng mã khuyến mãi rồi');
                setTimeout(() => setValidationError(''), 3000);
                return;
            }

            const response = await promotionApis.getPromotionByCode(code);
            setPromotion(response.data.data);
            calTotalAfterUsePromotion(response.data.data);
            setValidationError('');
            setShowPromotionSuggestions(false);
        } catch (error) {
            setValidationError('Mã khuyến mãi không hợp lệ hoặc đã hết hạn');
            setTimeout(() => setValidationError(''), 3000);
        }
    };

    const handleSelectSuggestion = (code) => {
        setPromotionCode(code);
        setShowPromotionSuggestions(false);
    };

    const calTotalAfterUsePromotion = (promotion) => {
        let discount = 0;
        if (promotion.type === 'PERCENT') {
            if (total >= promotion.minimumOrder) {
                discount = (total * promotion.value) / 100;
                discount = Math.min(promotion.maxDiscount, discount);
            }
        } else {
            if (total >= promotion.minimumOrder) {
                discount = promotion.value;
                discount = Math.min(promotion.maxDiscount, discount);
            }
        }
        setTotal(total - discount);
        return `- ${formatCurrency(discount)}`;
    };

    const validateOrder = () => {
        // Kiểm tra đăng nhập
        if (!userInfo) {
            setValidationError('Vui lòng đăng nhập để đặt hàng');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return false;
        }

        // Kiểm tra giỏ hàng
        if (!cart || cart.length === 0) {
            setValidationError('Giỏ hàng trống. Vui lòng thêm sản phẩm');
            return false;
        }

        // Kiểm tra thông tin cơ bản
        if (!email || !email.trim()) {
            setValidationError('Vui lòng nhập email');
            return false;
        }

        if (!name || !name.trim()) {
            setValidationError('Vui lòng nhập họ và tên');
            return false;
        }

        if (!phone || !phone.trim()) {
            setValidationError('Vui lòng nhập số điện thoại');
            return false;
        }

        // Validate số điện thoại
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            setValidationError('Số điện thoại không hợp lệ');
            return false;
        }

        if (!address || !address.trim()) {
            setValidationError('Vui lòng nhập địa chỉ cụ thể');
            return false;
        }

        // Kiểm tra địa chỉ
        if (!selectedProvince || selectedProvince === '9999') {
            setValidationError('Vui lòng chọn Tỉnh/Thành phố');
            return false;
        }

        if (!selectedDistrict || selectedDistrict === '9999') {
            setValidationError('Vui lòng chọn Quận/Huyện');
            return false;
        }

        if (!selectedWard || selectedWard === '9999') {
            setValidationError('Vui lòng chọn Phường/Xã');
            return false;
        }

        // Kiểm tra phương thức giao hàng
        if (selectMethodShip === 'delivery' && (!selectedProvince || selectedProvince === '9999')) {
            setValidationError('Vui lòng chọn địa chỉ đầy đủ để giao hàng tận nơi');
            return false;
        }

        return true;
    };

    const placeAnOrder = async () => {
        // Xóa lỗi cũ
        setValidationError('');

        // Validate
        if (!validateOrder()) {
            setTimeout(() => setValidationError(''), 5000);
            return;
        }

        const order = {
            customerId: userInfo.id,
            name,
            email,
            phone,
            address,
            province: selectedProvince,
            district: selectedDistrict,
            ward: selectedWard,
            note,
            methodDelivery: selectMethodShip,
            paymentMethod: selectMethodPay,
            deliveryFee,
            promotionCode,
            cart,
            total: total + deliveryFee,
            discount: temp - total,
        };

        try {
            const response = await orderApis.createOrder(order);
            // console.log(response.data.data.paymentLink);
            if (selectMethodPay === 'VNPAY') {
                if (response.data.status === 200) {
                    window.location.href = response.data.data.paymentLink;
                }
            } else {
                setIsShowNotificationSuccess(true);
                setCart([]);
                localStorage.setItem('cart', '[]');
            }
        } catch (error) {
            setValidationError('Đặt hàng thất bại. Vui lòng thử lại sau');
            setTimeout(() => setValidationError(''), 5000);
        }
    };

    const onCloseSuccess = () => {
        setIsShowNotificationSuccess(false);
        clearCart();
        navigate('/');
    };

    const onCloseFail = () => {
        setIsShowNotificationFail(false);
    };

    const onCloseError = () => {
        setIsShowNotificationError(false);
        navigate('/');
    };

    return (
        <>
            {isShowNotificationSuccess && <OrderSuccess onClose={onCloseSuccess} />}
            {isShowNotificationFail && <OrderFailure onClose={onCloseFail} />}
            {isShowNotificationError && <OrderError onClose={onCloseError} />}
            <div className={styles.wrapper}>
                <div className={styles.left}>
                    <div className={styles.logo} onClick={() => navigate('/')} title="Quay về trang chủ">
                        <img src={image} alt="logo" />
                    </div>

                    {/* Cảnh báo cần chọn địa chỉ */}
                    {showAddressWarning && (
                        <div className={styles['address-warning']}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span>
                                Vui lòng chọn đầy đủ địa chỉ (Tỉnh/Thành phố, Quận/Huyện, Phường/Xã) để tiếp tục đặt
                                hàng
                            </span>
                        </div>
                    )}

                    {/* Thông báo lỗi validation */}
                    {validationError && (
                        <div className={styles['validation-error']}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className={styles.form}>
                        <div className={styles['left-form']}>
                            <h3>Thông tin nhận hàng</h3>

                            <div className={styles.info}>
                                <InputForm value={email} onChange={setEmail} type="email" placeholder="Email *" />
                                <InputForm value={name} onChange={setName} type="text" placeholder="Họ và tên *" />
                                <InputForm
                                    value={phone}
                                    onChange={setPhone}
                                    type="text"
                                    placeholder="Số điện thoại *"
                                />
                                <InputForm
                                    value={address}
                                    onChange={setAddress}
                                    type="text"
                                    placeholder="Địa chỉ cụ thể *"
                                />

                                <ChooseInput
                                    value={provinces}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    type={1}
                                />
                                <ChooseInput
                                    value={districts}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    type={2}
                                />
                                <ChooseInput value={wards} type={3} onChange={(e) => setSelectedWard(e.target.value)} />

                                <InputNote value={note} onChange={setNote} />
                            </div>
                        </div>

                        <div className={styles['right-form']}>
                            <h3>Vận chuyển</h3>
                            <div className={styles['method-wrapper']}>
                                {selectedProvince !== '9999' &&
                                selectedDistrict !== '9999' &&
                                selectedWard !== '9999' ? (
                                    <>
                                        <div
                                            className={styles.method}
                                            onClick={() => {
                                                setSelectMethodShip('pickup');
                                                setDeliveryFee(0);
                                            }}
                                        >
                                            <div>
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    checked={selectMethodShip === 'pickup'}
                                                    readOnly
                                                />
                                                <label>Nhận tại cửa hàng</label>
                                            </div>
                                            <span>Miễn phí</span>
                                        </div>

                                        <div
                                            className={styles.method}
                                            onClick={() => {
                                                setSelectMethodShip('delivery');
                                                setDeliveryFee(35000);
                                            }}
                                        >
                                            <div>
                                                <input
                                                    type="radio"
                                                    name="delivery"
                                                    checked={selectMethodShip === 'delivery'}
                                                    readOnly
                                                />
                                                <label>Giao hàng tận nơi</label>
                                            </div>
                                            <span>35.000đ</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles['no-address']}>
                                        <i className="fa-solid fa-location-dot"></i>
                                        <span>Vui lòng chọn đầy đủ địa chỉ để hiển thị phương thức vận chuyển</span>
                                    </div>
                                )}
                            </div>

                            <h3 style={{ marginTop: 20 }}>Thanh toán</h3>
                            <div className={styles['payment-method']} onClick={() => handleClick('VNPAY')}>
                                <div>
                                    <input type="radio" name="payment" checked={selectMethodPay === 'VNPAY'} readOnly />
                                    <label>Chuyển khoản qua ngân hàng</label>
                                </div>
                                <i className="fa-solid fa-building-columns"></i>
                            </div>

                            <div className={styles['payment-method']} onClick={() => handleClick('COD')}>
                                <div>
                                    <input type="radio" name="payment" checked={selectMethodPay === 'COD'} readOnly />
                                    <label>Thanh toán khi nhận hàng (COD)</label>
                                </div>
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                            <div
                                className={`${styles['payment-method-note']} ${selectMethodPay === 'COD' ? styles['payment-method-note-show'] : ''} `}
                            >
                                <div>Bạn chỉ phải thanh toán khi nhận được hàng.</div>
                                <br />
                                <div>Đơn vị vận chuyển bên Hắc Tê đang sử dụng: Giao hàng tiết kiệm</div>
                            </div>

                            <div className={styles['payment-method']} onClick={() => handleClick('MOMO')}>
                                <div>
                                    <input type="radio" name="payment" checked={selectMethodPay === 'MOMO'} readOnly />
                                    <label>Thanh toán qua Momo</label>
                                </div>
                                <i className="fa-brands fa-cc-paypal"></i>
                            </div>
                            <div
                                className={`${styles['payment-method-note']} ${selectMethodPay === 'MOMO' ? styles['payment-method-note-show'] : ''} `}
                            >
                                <div>Bạn vui lòng chuyển momo qua:</div>
                                <br />
                                <div>Số điện thoại: 0784712443</div>
                                <br />
                                <div>Chủ tài khoản: Trần Hoàng Vương</div>
                                <br />
                                <div>Nội dung chuyển: HD + Tên + SĐT</div>
                                <br />
                                <div>
                                    Sau khi xác nhận giao dịch qua Momo, Hắc Tê sẽ gửi email xác nhận đơn hàng qua email
                                    của bạn.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.right}>
                    <h4>Đơn hàng ({cart.length} sản phẩm)</h4>

                    <hr />

                    {isShowNotificationExceedQuantity && (
                        <div className={styles['exceed-notification']}>
                            <i className="fa-solid fa-circle-info"></i>
                            <div>
                                Một số sản phẩm vượt quá số lượng trong kho.
                                <br />
                                <strong>Giỏ hàng đã tự động điều chỉnh số lượng có thể mua.</strong>
                            </div>
                        </div>
                    )}

                    {cart.length === 0 ? (
                        <div className={styles['empty-cart']}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            <p>Giỏ hàng trống</p>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className={styles['cart-item']}>
                                <div
                                    className={`${styles['cart-item-img']} ${item.quantity <= 0 ? styles['cart-item-img-exceeded'] : ''}`}
                                >
                                    <img
                                        src={item?.product?.imageLink || 'https://placehold.co/70x70?text=No+Image'}
                                        alt={item?.product.name || 'ảnh'}
                                    />
                                </div>
                                <div
                                    className={`${styles['cart-item-name']} ${item.quantity <= 0 ? styles['cart-item-name-exceeded'] : ''}`}
                                >
                                    {item?.product.name}
                                    {item.quantity <= 0 && (
                                        <span className={styles['out-of-stock-label']}>Hết hàng</span>
                                    )}
                                </div>
                                <div
                                    className={`${styles['cart-item-price']} ${item.quantity <= 0 ? styles['cart-item-price-exceeded'] : ''}`}
                                >
                                    {formatCurrency(item?.product.price)}
                                </div>

                                <div
                                    className={`${styles['cart-item-badge']} ${item.quantity <= 0 ? styles['cart-item-badge-exceeded'] : ''}`}
                                >
                                    {item.quantity}
                                </div>
                            </div>
                        ))
                    )}

                    <hr />

                    <div className={styles['promotion']}>
                        <div className={styles['promotion-wrapper']}>
                            <div className={styles['promotion-code']}>
                                <input
                                    type="text"
                                    value={promotionCode}
                                    onChange={(e) => setPromotionCode(e.target.value)}
                                    onFocus={() => setShowPromotionSuggestions(true)}
                                    placeholder="Nhập mã khuyến mãi"
                                    disabled={promotion !== null}
                                />
                                {showPromotionSuggestions && promotion === null && (
                                    <div className={styles['promotion-suggestions']}>
                                        <div className={styles['suggestions-header']}>
                                            <span>Mã khuyến mãi có sẵn</span>
                                            <i
                                                className="fa-solid fa-xmark"
                                                onClick={() => setShowPromotionSuggestions(false)}
                                            ></i>
                                        </div>
                                        {promotionSuggestions.map((item, index) => (
                                            <div
                                                key={index}
                                                className={styles['suggestion-item']}
                                                onClick={() => handleSelectSuggestion(item.code)}
                                            >
                                                <div className={styles['suggestion-content']}>
                                                    <i className="fa-solid fa-ticket"></i>
                                                    <div>
                                                        <div className={styles['suggestion-code']}>{item.code}</div>
                                                        <div className={styles['suggestion-desc']}>
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div
                                className={`${styles['promotion-active']} ${promotion !== null ? styles['promotion-disabled'] : ''}`}
                                onClick={() => addPromotion(promotionCode)}
                            >
                                {promotion ? 'Đã áp dụng' : 'Áp dụng'}
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className={styles['summary-row']}>
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(temp)}</span>
                    </div>

                    <div className={styles['summary-row']}>
                        <span>Phí vận chuyển:</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                    </div>

                    {promotion && (
                        <div className={styles['summary-row']} style={{ color: '#28a745' }}>
                            <span>Khuyến mãi:</span>
                            <span>{`- ${formatCurrency(temp - total)}`}</span>
                        </div>
                    )}

                    <hr />

                    <div className={styles['summary-total']}>
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(total + deliveryFee < 0 ? 0 : total + deliveryFee)}</span>
                    </div>

                    <button className={styles['pay-btn']} onClick={placeAnOrder}>
                        Đặt hàng
                    </button>
                </div>
            </div>
        </>
    );
};

export default Payment;
