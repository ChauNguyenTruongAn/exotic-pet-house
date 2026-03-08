import styles from './Breadcrumb.module.scss';

const Breadcrumb = ({ breadcrumb }) => {
    return (
        <div className={styles['breadcrumb']}>
            {breadcrumb.map((item, index) => (
                <span key={index}>
                    {item}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
