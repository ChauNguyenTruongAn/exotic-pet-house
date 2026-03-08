import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { FaUserEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import loginApi from '../../apis/logApi';


const Profile = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
    });

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await loginApi.me();
                const data = res.data.data;
                setUser(data);
                setForm(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        try {
            const res = await loginApi.update(form); // PUT /users/me
            toast.success('Cập nhật thông tin thành công!');
            setUser(form);
            setEditing(false);
        } catch (err) {
            console.error(err);
            toast.error('Cập nhật thất bại!');
        }
    };

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Thông tin cá nhân</h1>

            <div className={styles.profileCard}>
                {/* Avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>{user.fullName.charAt(0).toUpperCase()}</div>
                    <button className={styles.editBtn} onClick={() => setEditing(!editing)}>
                        <FaUserEdit /> Chỉnh sửa
                    </button>
                </div>

                {/* Form Info */}
                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="text" value={form.email} disabled />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                    </div>
                </div>

                {/* Buttons */}
                {editing && (
                    <div className={styles.actionArea}>
                        <button className={styles.saveBtn} onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => {
                                setForm(user);
                                setEditing(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
