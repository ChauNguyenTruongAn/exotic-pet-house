import { useEffect, useState } from 'react';
import styles from './ForgotPassword.module.scss';
import loginApi from '../../apis/logApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (success) {
            const timeoutId = setTimeout(() => navigate('/login'), 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [success]);

    const navigate = useNavigate('');
    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim()) {
            return setError('Vui lòng nhập email');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError('Email không hợp lệ');
        }

        try {
            setLoading(true);
            await handleForgot(email); // gọi API từ cha
            toast.success('Hệ thống đã gửi mật khẩu mới qua mail.');
            setSuccess('Hệ thống đã gửi mật khẩu mới qua mail.');
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (email) => {
        await loginApi.forgotPassword(email);
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.card} onSubmit={onSubmit}>
                <h2>Quên mật khẩu</h2>
                <p className={styles.desc}>Nhập email đăng ký để nhận hướng dẫn đặt lại mật khẩu.</p>

                <input
                    type="email"
                    className={styles.input}
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <button className={styles.button} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
