import styles from './OrderFailure.module.scss';

export default function OrderFailure({ onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <div className={styles.checkmark}></div>
                </div>
                <h2 className={styles.title}>Đặt hàng không thành công!</h2>
                <p className={styles.message}>Vui lòng kiểm tra lại thanh toán!.</p>

                <button className={styles.button} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}
