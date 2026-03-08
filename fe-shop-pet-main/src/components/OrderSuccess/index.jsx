import styles from './OrderSuccess.module.scss';

export default function OrderSuccess({ onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <div className={styles.checkmark}></div>
                </div>
                <h2 className={styles.title}>Đặt hàng thành công!</h2>
                <p className={styles.message}>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ để xác nhận đơn!</p>

                <button className={styles.button} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}
