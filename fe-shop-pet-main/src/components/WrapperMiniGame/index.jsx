import styles from './WrapperMiniGame.module.scss';

const WrapperMiniGame = ({ onOpenMiniGame }) => {
    return (
        <div className={styles.miniGameWrap} onClick={onOpenMiniGame}>
            <div className={styles.miniGameBtn}>⏱ Bấm giờ 10s</div>
        </div>
    );
};

export default WrapperMiniGame;
