import { useEffect, useState } from 'react';
import styles from './AdminHeader.module.scss';
import { useNavigate } from 'react-router-dom';

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''),
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const AdminHeader = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (token) {
            const decoded = parseJwt(token);
            setUserInfo(decoded);
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className={styles.wrapper}>
            <div className={styles.leftSection}>
                <h2 className={styles.brand}>My Dashboard</h2>
            </div>

            <div className={styles.rightSection}>
                {userInfo && (
                    <div
                        className={styles.profileWrapper}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <div className={styles.profile} onClick={toggleDropdown}>
                            <div className={styles.info}>
                                <span className={styles.name}>{userInfo.fullName}</span>
                                <span className={styles.role}>{userInfo.role}</span>
                            </div>
                            <div className={styles.avatar}>{userInfo.fullName.charAt(0)}</div>
                        </div>

                        {dropdownOpen && (
                            <div className={styles.dropdown}>
                                <p onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;
