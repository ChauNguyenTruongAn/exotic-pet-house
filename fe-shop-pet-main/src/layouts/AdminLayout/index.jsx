import React from 'react';
import AdminSideBar from '../components/AdminSideBar';
import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
    return (
        <div className={styles['admin-layout']}>
            <AdminSideBar />
            <div className={styles['content']}>
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
