import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHistory, FaSignOutAlt, FaUser } from 'react-icons/fa';
import styles from './UserMenu.module.scss';
import { useAuth } from '@/context';

const UserMenu = ({ decodeToken }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.userMenu} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <div className={styles.userInfo}>
                <FaUserCircle className={styles.avatar} />
                <span>{decodeToken.fullName}</span>
            </div>

            {open && (
                <div className={styles.dropdown}>
                    <Link to="/profile" className={styles.item}>
                        <FaUser /> Thông tin tài khoản
                    </Link>

                    <Link to="/order-history" className={styles.item}>
                        <FaHistory /> Lịch sử đơn hàng
                    </Link>

                    <Link to="/change-password" className={styles.item}>
                        <FaUser /> Đổi mật khẩu
                    </Link>

                    <button className={styles.item} onClick={handleLogout}>
                        <FaSignOutAlt /> Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
