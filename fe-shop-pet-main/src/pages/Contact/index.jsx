import React, { useState } from 'react';
import styles from './Contact.module.scss';
import mailApis from '../../apis/mailApis';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Không được để trống';
        if (!form.email.trim()) newErrors.email = 'Không được để trống';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email sai định dạng';

        if (!form.phone.trim()) newErrors.phone = 'Không được để trống';
        if (!form.message.trim()) newErrors.message = 'Không được để trống';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            console.log(form);
            const response = await mailApis.sendMail(form);
            console.log(response);
            alert('Gửi tin nhắn thành công!');
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={styles['wrapper']}>
            {/* --- Cột trái: Thông tin liên hệ --- */}
            <div className={styles['left']}>
                <h2 className={styles['left-title']}>THÔNG TIN LIÊN HỆ</h2>

                <p className={styles['shop-name']}>Night Fury - Exoticzone</p>

                <div className={styles['info-item']}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>30 đường số 266, Phường 06, Quận 8, Thành phố Hồ Chí Minh</span>
                </div>

                <div className={styles['info-item']}>
                    <i className="fa-solid fa-phone"></i>
                    <span>0779 13 07 93</span>
                </div>

                <div className={styles['info-item']}>
                    <i className="fa-solid fa-envelope"></i>
                    <span>shop@gmail.com</span>
                </div>
            </div>

            {/* --- Cột phải: Gửi thông tin --- */}
            <div className={styles['right']}>
                <h2 className={styles['right-title']}>GỬI THÔNG TIN</h2>
                <p className={styles['right-desc']}>
                    Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi. Chúng tôi sẽ phản hồi bạn sớm
                    nhất.
                </p>

                <form onSubmit={handleSubmit} className={styles['form']}>
                    {/* Họ tên */}
                    <div className={styles['form-group']}>
                        <label>Họ tên*</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={errors.name ? styles['error-input'] : ''}
                        />
                        {errors.name && <span className={styles['error-text']}>{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className={styles['form-group']}>
                        <label>Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={errors.email ? styles['error-input'] : ''}
                        />
                        {errors.email && <span className={styles['error-text']}>{errors.email}</span>}
                    </div>

                    {/* Điện thoại */}
                    <div className={styles['form-group']}>
                        <label>Điện thoại*</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={errors.phone ? styles['error-input'] : ''}
                        />
                        {errors.phone && <span className={styles['error-text']}>{errors.phone}</span>}
                    </div>

                    {/* Nội dung */}
                    <div className={styles['form-group']}>
                        <label>Nội dung*</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className={errors.message ? styles['error-input'] : ''}
                        ></textarea>
                        {errors.message && <span className={styles['error-text']}>{errors.message}</span>}
                    </div>

                    <button type="submit" className={styles['btn-submit']}>
                        GỬI TIN NHẮN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
