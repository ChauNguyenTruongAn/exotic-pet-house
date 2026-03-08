import React from 'react';
import { Link, Navigate, replace, useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminSideBar.module.scss';
import logo from '@/assets/images/logo2.png';
import { ADMIN_ABSOLUTE_ROUTES } from '../../../configs/routes';

const AdminSlideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Nhóm menu chính
    const mainMenu = [{ title: 'Dashboard', icon: 'fa-solid fa-chart-line', path: '/admin' }];

    // Nhóm menu quản lý
    const manageMenus = [
        { title: 'Quản lý danh mục', icon: 'fa-solid fa-list', path: ADMIN_ABSOLUTE_ROUTES.category },
        { title: 'Quản lý loài', icon: 'fa-solid fa-layer-group', path: ADMIN_ABSOLUTE_ROUTES.species },
        { title: 'Quản lý sản phẩm', icon: 'fa-solid fa-boxes-stacked', path: ADMIN_ABSOLUTE_ROUTES.product },
        { title: 'Quản lý người dùng', icon: 'fa-solid fa-user-group', path: ADMIN_ABSOLUTE_ROUTES.user },
        { title: 'Quản lý hóa đơn', icon: 'fa-solid fa-receipt', path: ADMIN_ABSOLUTE_ROUTES.receipt },
        { title: 'Quản lý giảm giá', icon: 'fa-solid fa-percent', path: ADMIN_ABSOLUTE_ROUTES.promotion },
        { title: 'Quản lý kho', icon: 'fa-solid fa-warehouse', path: ADMIN_ABSOLUTE_ROUTES.inventory },
    ];

    return (
        <div className={styles['sidebar']}>
            {/* --- Logo --- */}
            <div
                title="Về trang chủ"
                className={styles['logo-section']}
                onClick={() => {
                    navigate('/admin');
                }}
            >
                <div className={styles['logo-link']}>
                    <img src={logo} alt="Admin Logo" className={styles['logo']} />
                    <span className={styles['brand-name']}>Admin</span>
                </div>
            </div>

            {/* --- Dashboard --- */}
            <div className={styles['menu-group']}>
                <h4 className={styles['group-title']}>Tổng quan</h4>
                <ul className={styles['menu-list']}>
                    {mainMenu.map((item, index) => (
                        <li
                            key={index}
                            className={`${styles['menu-item']} ${
                                location.pathname === item.path ? styles['active'] : ''
                            }`}
                        >
                            <Link to={item.path}>
                                <i className={item.icon}></i>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- Quản lý --- */}
            <div className={styles['menu-group']}>
                <h4 className={styles['group-title']}>Quản lý hệ thống</h4>
                <ul className={styles['menu-list']}>
                    {manageMenus.map((item, index) => (
                        <li
                            key={index}
                            className={`${styles['menu-item']} ${
                                location.pathname === item.path ? styles['active'] : ''
                            }`}
                        >
                            {/* Lỗi khi ấn liên tiếp vào item sẽ bị đè đường dẫn */}
                            <Link to={item.path}>
                                <i className={item.icon}></i>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminSlideBar;
