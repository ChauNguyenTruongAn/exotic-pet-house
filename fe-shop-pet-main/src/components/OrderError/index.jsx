import styles from './OrderError.module.scss';

export default function OrderError({ onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <div className={styles.checkmark}></div>
                </div>
                <h2 className={styles.title}>Phát hiện gian lận!</h2>
                <p className={styles.message}>Vui lòng kiểm tra lại thanh toán!.</p>

                <button className={styles.button} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}
