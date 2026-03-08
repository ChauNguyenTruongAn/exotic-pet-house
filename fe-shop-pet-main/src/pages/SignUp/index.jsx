import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.scss';
import registerApi from '../../apis/registerApi';
import { FiUser, FiMail, FiLock, FiPhone, FiHome } from 'react-icons/fi';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });

    const [errors, setErrors] = useState({});

    // --- VALIDATION RULES ---
    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim() || formData.fullName.length < 3)
            newErrors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';

        if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

        if (!/^(0|\+84)(\d{9})$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';

        if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear lỗi ngay khi user nhập
        setErrors({ ...errors, [name]: '' });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await registerApi.register(formData);
            if (response?.data?.status) {
                navigate('/login');
            } else {
                setErrors({ general: 'Đăng ký thất bại, vui lòng kiểm tra lại!' });
            }
        } catch (err) {
            setErrors({ general: err.response?.data || 'Lỗi không xác định' });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1>Tạo tài khoản mới</h1>

                {errors.general && <p className={styles.errorGeneral}>{errors.general}</p>}

                <form onSubmit={handleRegister} className={styles.form}>
                    {/* Full name */}
                    <div className={styles.inputGroup}>
                        <FiUser className={styles.icon} />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ và tên"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <FiMail className={styles.icon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.email && <p className={styles.error}>{errors.email}</p>}

                    {/* Password */}
                    <div className={styles.inputGroup}>
                        <FiLock className={styles.icon} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.password && <p className={styles.error}>{errors.password}</p>}

                    {/* Confirm password */}
                    <div className={styles.inputGroup}>
                        <FiLock className={styles.icon} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

                    {/* Phone */}
                    <div className={styles.inputGroup}>
                        <FiPhone className={styles.icon} />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.phone && <p className={styles.error}>{errors.phone}</p>}

                    {/* Address */}
                    <div className={styles.inputGroup}>
                        <FiHome className={styles.icon} />
                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.address && <p className={styles.error}>{errors.address}</p>}

                    <button type="submit" className={styles.btnRegister}>
                        Đăng ký
                    </button>
                </form>

                <p className={styles.loginText}>
                    Đã có tài khoản?{' '}
                    <Link to="/login" className={styles.loginLink}>
                        Đăng nhập tại đây
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
