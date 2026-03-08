import React, { useState } from 'react';
import styles from './ChangePassword.module.scss';
import { toast } from 'react-toastify';
import loginApi from '../../apis/logApi';
import { FaLock, FaSave } from 'react-icons/fa';

const ChangePassword = () => {
    const [form, setForm] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let temp = {};

        if (!form.email.trim()) temp.email = 'Email không được để trống';
        else if (!/\S+@\S+\.\S+/.test(form.email)) temp.email = 'Email không hợp lệ';

        if (!form.oldPassword) temp.oldPassword = 'Vui lòng nhập mật khẩu cũ';

        if (!form.newPassword) temp.newPassword = 'Vui lòng nhập mật khẩu mới';
        else if (form.newPassword.length < 6) temp.newPassword = 'Mật khẩu phải >= 6 ký tự';

        if (!form.confirmPassword) temp.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        else if (form.newPassword !== form.confirmPassword) temp.confirmPassword = 'Mật khẩu xác nhận không khớp';

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const req = {
                email: form.email,
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            };

            await loginApi.changePassword(req);

            toast.success('Đổi mật khẩu thành công!');
            setForm({
                email: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Đổi mật khẩu</h1>

            <div className={styles.card}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email tài khoản"
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Mật khẩu cũ</label>
                    <input
                        name="oldPassword"
                        type="password"
                        value={form.oldPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                    {errors.oldPassword && <p className={styles.error}>{errors.oldPassword}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Mật khẩu mới</label>
                    <input
                        name="newPassword"
                        type="password"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới"
                    />
                    {errors.newPassword && <p className={styles.error}>{errors.newPassword}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                </div>

                <button className={styles.btn} onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        'Đang xử lý...'
                    ) : (
                        <>
                            <FaSave /> Lưu mật khẩu
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;
