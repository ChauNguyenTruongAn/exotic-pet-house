import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaHistory } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

import styles from './Header.module.scss';
import Navbar from '../../../components/Navbar';
import logo from '@/assets/images/logo2.png';
import { useAuth } from '../../../context';
import { useCart } from '../../../context/cart';
import orderApis from '../../../apis/orderApis';
import OrderDropdown from '../OrderDropdown';
import { useSearch } from '../../../context/search';
import UserMenu from '../../../components/UserMenu';
import MiniGame from '../../../components/MiniGame';
import { toast } from 'react-toastify';
import WrapperMiniGame from '../../../components/WrapperMiniGame';

const Header = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [orders, setOrders] = useState([]);
    const [decodeToken, setDecodeToken] = useState(null);
    const [showOrders, setShowOrders] = useState(false);
    const navigate = useNavigate();

    const { search, setSearch, isSearch, setIsSearch } = useSearch();

    const token = localStorage.getItem('accessToken');

    const [isShowMiniGame, setIsShowMiniGame] = useState(false);

    useEffect(() => {
        if (token) {
            setDecodeToken(jwtDecode(token));
            const fetchOrders = async () => {
                try {
                    const res = await orderApis.getAllOrder();
                    setOrders(res.data.data || []);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchOrders();
        } else {
            setDecodeToken(null);
        }
    }, [token, user]);

    const handleLogout = () => {
        logout();
        setDecodeToken(null);
        navigate('/login');
    };

    const searchProduct = async () => {
        await navigate('/product');
        await setIsSearch(true);
    };

    const onCloseMiniGame = () => {
        setIsShowMiniGame(false);
    };

    const onOpenMiniGame = () => {
        if (localStorage.getItem('accessToken') === null) {
            toast.error('Vui lòng đăng nhập để chơi game!');
            return navigate('/login');
        }
        setIsShowMiniGame(true);
    };

    return (
        <header className={styles.header}>
            {/* ===== TOP BAR ===== */}
            <div className={styles.topBar}>
                <div className={styles.topLeft}></div>
                <div className={styles.topRight}>
                    {user && decodeToken ? (
                        <UserMenu decodeToken={decodeToken} />
                    ) : (
                        <>
                            <div className={styles.authBox}>
                                <Link to="/login" className={styles.loginBtn}>
                                    <i className="fa-solid fa-user"></i>
                                    Đăng nhập
                                </Link>

                                <Link to="/register" className={styles.registerBtn}>
                                    <i className="fa-solid fa-user-plus"></i>
                                    Đăng ký
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ===== MIDDLE BAR ===== */}
            <div className={styles.middleBar}>
                {/* SEARCH LEFT */}
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button onClick={searchProduct}>
                        <FaSearch />
                    </button>
                </div>

                {/* LOGO CENTER */}
                <div className={styles.logoContainer}>
                    <Link to="/">
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </Link>
                </div>

                {/* ACTION RIGHT */}
                <div className={styles.actionRight}>
                    <div className={styles['mini-game']}>
                        {isShowMiniGame ? (
                            <MiniGame onClose={onCloseMiniGame} />
                        ) : (
                           <WrapperMiniGame onOpenMiniGame={onOpenMiniGame}/>
                        )}
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.cart} onClick={() => navigate('/cart')}>
                            <FaShoppingCart />
                            <span className={styles.cartCount}>{cart?.length || 0}</span>
                        </div>

                        {decodeToken && (
                            <div
                                className={styles.orderHistory}
                                onMouseEnter={() => setShowOrders(true)}
                                onMouseLeave={() => setShowOrders(false)}
                            >
                                <FaHistory />
                                {showOrders && orders.length > 0 && <OrderDropdown orders={orders} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== NAVBAR ===== */}
            <div className={styles.bottomBar}>
                <Navbar />
            </div>
        </header>
    );
};

export default Header;
