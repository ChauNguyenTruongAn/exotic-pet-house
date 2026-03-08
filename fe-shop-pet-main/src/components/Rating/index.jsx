// Rating.jsx
import styles from "./Rating.module.scss";

const Rating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<span key={i} className={styles.full}>★</span>);
        } else if (rating >= i - 0.5) {
            stars.push(<span key={i} className={styles.half}>★</span>);
        } else {
            stars.push(<span key={i} className={styles.empty}>★</span>);
        }
    }

    return (
        <div className={styles.rating}>
            {stars}
            <span className={styles.number}>{rating.toFixed(1)}</span>
        </div>
    );
};

export default Rating;
