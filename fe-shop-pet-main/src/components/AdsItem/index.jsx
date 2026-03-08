import styles from './AdsItem.module.scss';

const AdsItem = ({ name, description, icon }) => {
    return (
        <div className={styles['wrapper']}>
            <div className={styles['icon']}>{icon}</div>
            <div className={styles['detail']}>
                <div className={styles['name']}>{name}</div>
                <div className={styles['description']}>{description}</div>
            </div>
        </div>
    );
};

export default AdsItem;
