import styles from './ProductButton.module.scss';

const ProductButton = ({ icon, name, onClick }) => {
    return (
        <div className={styles.wrapper} onClick={onClick}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.name}>{name}</div>
        </div>
    );
};

export default ProductButton;
