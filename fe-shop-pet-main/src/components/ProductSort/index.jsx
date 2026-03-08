import styles from './ProductSort.module.scss';

const ProductSort = ({ title, handleSort }) => {
    return (
        <div className={styles.wrapper}>
            {title && <h2 className={styles.title}>{title}</h2>}

            <div className={styles['filter-wrapper']}>
                <p>Xếp theo:</p>

                <input type="radio" name="sort" id="atoz" onClick={() => handleSort({ sort: 'name,asc' })} />
                <label htmlFor="atoz">Tên A-Z</label>

                <input type="radio" name="sort" id="ztoa" onClick={() => handleSort({ sort: 'name,desc' })} />
                <label htmlFor="ztoa">Tên Z-A</label>

                <input type="radio" name="sort" id="desc" onClick={() => handleSort({ sort: 'price,desc' })} />
                <label htmlFor="desc">Giá cao đến thấp</label>

                <input type="radio" name="sort" id="asc" onClick={() => handleSort({ sort: 'price,asc' })} />
                <label htmlFor="asc">Giá thấp tới cao</label>
            </div>
        </div>
    );
};

export default ProductSort;
