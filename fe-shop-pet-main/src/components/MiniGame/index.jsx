import { useEffect, useRef, useState } from 'react';
import styles from './MiniGame.module.scss';
import promotionApis from '../../apis/promotionApis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MiniGame = ({ onClose }) => {
    const [targetTime, setTargetTime] = useState(10);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [isWin, setIsWin] = useState(false);

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const startTimeRef = useRef(null);

    const navigate = useNavigate();

    const startGame = () => {
        setResult(null);
        setIsWin(false);
        setTime(0);
        setIsRunning(true);

        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            setTime((Date.now() - startTimeRef.current) / 1000);
        }, 50);
    };

    const stopGame = async () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);

        const finalTime = (Date.now() - startTimeRef.current) / 1000;
        setTime(finalTime);

        const diff = Math.abs(finalTime - targetTime);

        //sửa thời gian minigame
        if (diff <= 100) {
            setIsWin(true);

            try {
                const res = await promotionApis.getPromotionByMinigame();
                toast.success('Mã khuyến mãi đã được gửi về email của bạn!');
                setResult('Bạn đã thắng! Đang gửi thưởng qua email...');

                timeoutRef.current = setTimeout(() => {
                    onClose();
                    navigate('/');
                }, 3000);
            } catch (err) {
                toast.error(err.response.data.message);
            }
        } else {
            setResult('Chưa chuẩn rồi, thử lại nhé!');
        }
    };

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={styles.game}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <h2 className={styles.title}>Canh Giờ Thần Tốc</h2>
                <p className={styles.subtitle}>Dừng đúng thời gian để nhận thưởng!</p>

                <div className={styles.setting}>
                    <label>
                        Thời gian mục tiêu (giây)
                        <input
                            type="number"
                            min={1}
                            disabled={isRunning}
                            value={targetTime}
                            onChange={(e) => setTargetTime(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div className={`${styles.timer} ${isRunning ? styles.timerRunning : ''}`}>{time.toFixed(2)}</div>

                <div className={styles.actions}>
                    <button onClick={startGame} disabled={isRunning}>
                        ▶ Start
                    </button>
                    <button onClick={stopGame} disabled={!isRunning}>
                        ⏹ Stop
                    </button>
                </div>

                {result && <div className={`${styles.result} ${isWin ? styles.win : styles.lose}`}>{result}</div>}
            </div>
        </div>
    );
};

export default MiniGame;
