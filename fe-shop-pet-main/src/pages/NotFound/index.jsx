import React from 'react';
import styles from './NotFound.module.scss';
import { Link } from 'react-router-dom'; // nếu bạn dùng React Router

const NotFound = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.container}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Oops! Trang bạn tìm không tồn tại 😿</h2>
                <p className={styles.text}>Có thể sản phẩm đã bị xóa, hoặc đường dẫn bị sai.</p>
                <Link to="/" className={styles.btn}>
                    Quay lại cửa hàng
                </Link>
                <div className={styles.image}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="Cat confused" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
