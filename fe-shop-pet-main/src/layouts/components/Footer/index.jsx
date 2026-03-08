import { useState } from 'react';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo2.png';
import promotionApis from '../../../apis/promotionApis';
import { toast } from 'react-toastify';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = async () => {
        if (!email.trim()) {
            return toast.error('Vui lòng nhập email!');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error('Email không hợp lệ!');
        }

        try {
            const res = await promotionApis.getPromotionByFooter(email);
            if (res?.data?.status != 400) {
                toast.success('Đăng ký nhận khuyến mãi thành công!');
                setEmail(''); // clear input
            } else {
                toast.error(res.data.message);
                setEmail(''); // clear input
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };

    return (
        <footer className={styles['footer']}>
            <div className={styles['wrapper']}>
                <div className={styles['left']}>
                    <Link to="/" className={styles['logoLink']}>
                        <img src={logo} alt="Logo" className={styles['logo']} />
                    </Link>

                    <p>
                        <strong>Địa chỉ:</strong> 30 đường số 266, Phường 06, Quận 8, TP. Hồ Chí Minh
                    </p>
                    <p>
                        <strong>Điện thoại:</strong> 0779 13 07 93
                    </p>
                    <p>
                        <strong>Email:</strong> hacteexoticzone@gmail.com
                    </p>

                    <div className={styles['socials']}>
                        <a href="#">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="#">
                            <i className="fa-brands fa-shopify"></i>
                        </a>
                        <a href="#">
                            <i className="fa-solid fa-comments"></i>
                        </a>
                        <a href="#">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                    </div>
                </div>

                <div className={styles['right']}>
                    <h3>Nhận tin khuyến mãi từ cửa hàng</h3>
                    <div className={styles['promoBox']}>
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSubscribe}>Đăng ký</button>
                    </div>
                </div>
            </div>

            <div className={styles['bottom']}>
                © {new Date().getFullYear()} Night Fury Exotic Zone. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
