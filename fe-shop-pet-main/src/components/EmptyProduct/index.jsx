import styles from './EmptyProduct.module.scss';
import { PackageSearch, Truck, Inbox } from 'lucide-react';

const EmptyProduct = ({ type = 'empty', message }) => {
    const renderIcon = () => {
        switch (type) {
            case 'coming':
                return <Truck className={styles.icon} />;
            case 'waiting':
                return <PackageSearch className={styles.icon} />;
            default:
                return <Inbox className={styles.icon} />;
        }
    };

    const defaultMsg = {
        empty: 'Hiện tại chưa có sản phẩm nào.',
        waiting: 'Đang chờ hàng... Vui lòng quay lại sau!',
        coming: 'Hàng đang nhập về, sẽ có sớm!',
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                {renderIcon()}
                <p className={styles.message}>{message || defaultMsg[type]}</p>
            </div>
        </div>
    );
};

export default EmptyProduct;
