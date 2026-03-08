import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.scss';

const LINKS = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Về Chúng Tôi', path: '/about' },
    { label: 'Sản phẩm', path: '/product' },
    { label: 'Khuyến mãi', path: '/promotion' },
    { label: 'Bảo hành', path: '/warranty' },
    { label: 'Liên hệ', path: '/contact' },
];

const Navbar = () => {
    const { pathname } = useLocation();

    return (
        <nav className={styles.wrapper}>
            {LINKS.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navbar;
