import styles from './ProductPagination.module.scss';

const ProductPagination = ({ page, totalPages, handleChangePage }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={styles.wrapper}>
            <button className={styles.pageBtn} onClick={() => handleChangePage(page - 1)} disabled={page === 1}>
                «
            </button>

            {pages.map((item) => (
                <button
                    key={item}
                    className={`${styles.pageBtn} ${item === page ? styles.active : ''}`}
                    onClick={() => handleChangePage(item)}
                >
                    {item}
                </button>
            ))}

            <button
                className={styles.pageBtn}
                onClick={() => handleChangePage(page + 1)}
                disabled={page === totalPages}
            >
                »
            </button>
        </div>
    );
};

export default ProductPagination;
