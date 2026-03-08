import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './Login.module.scss';
import loginApi from '../../apis/logApi';
import { useAuth } from '../../context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate('');

    const { login } = useAuth();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const decodeTokenAndCheckRole = (jwt) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decode = jwtDecode(token);
            if (decode.role === 'ADMIN') return true;
            return false;
        }

        return false;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginApi.login({ email, password });
            console.log(response);

            const result = response.data;

            if (response.status === 200) {
                const accessToken = result.accessToken;
                const refreshToken = result.refreshToken;

                login(accessToken, refreshToken);

                const role = decodeTokenAndCheckRole();

                if (role) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 403) {
                window.alert('Sai email hoặc mật khẩu!');
            } else if (error.response && error.response.status === 401) {
                window.alert('Bạn không có quyền truy cập!');
            } else {
                window.alert('Đăng nhập thất bại, vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['content-wrapper']}>
                <h1>ĐĂNG NHẬP TÀI KHOẢN</h1>
                <div className={styles['spacer']} />
                <div className={styles['info-container']}>
                    <p>Email</p>
                    <input type="email" className={styles['info-input']} onChange={handleEmail} />
                    <p>Password</p>
                    <input type="password" className={styles['info-input']} onChange={handlePassword} />
                </div>

                <button className={styles['btn-login']} onClick={handleLogin}>
                    ĐĂNG NHẬP
                </button>
                <Link className={styles['link-forgot-password']} to="/forgot-password">
                    Quên mật khẩu?
                </Link>
                <div className={styles['spacer']} />

                <p>
                    <Link className={styles['link-signup']} to="/register">
                        Bạn chưa có tài khoản. Đăng ký tại đây
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
