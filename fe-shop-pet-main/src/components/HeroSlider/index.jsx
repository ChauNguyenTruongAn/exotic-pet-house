import { useState, useEffect, useRef } from 'react';
import styles from './HeroSlider.module.scss';

import img1 from '@/assets/images/so1.jpg';
import img2 from '@/assets/images/so2.jpg';
import img3 from '@/assets/images/so3.jpg';

const images = [img1, img2, img3];

export default function HeroSlider() {
    const [current, setCurrent] = useState(1);
    const [transition, setTransition] = useState(true);
    const slideRef = useRef(null);
    const extendedImages = [images[images.length - 1], ...images, images[0]];

    const prevSlide = () => setCurrent((prev) => prev - 1);
    const nextSlide = () => setCurrent((prev) => prev + 1);

    useEffect(() => {
        if (current === extendedImages.length - 1) {
            const t = setTimeout(() => {
                setTransition(false);
                setCurrent(1);
            }, 400);
            return () => clearTimeout(t);
        }
        if (current === 0) {
            const t = setTimeout(() => {
                setTransition(false);
                setCurrent(images.length);
            }, 400);
            return () => clearTimeout(t);
        }
        setTransition(true);
    }, [current]);

    return (
        <div className={styles.slider}>
            <button className={styles.arrowLeft} onClick={prevSlide}>
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div
                ref={slideRef}
                className={styles.slideWrapper}
                style={{
                    transform: `translateX(-${current * 100}%)`,
                    transition: transition ? 'transform 0.4s ease-in-out' : 'none',
                }}
            >
                {extendedImages.map((img, index) => (
                    <div className={styles.slide} key={index}>
                        <img src={img} alt={`slide-${index}`} />
                    </div>
                ))}
            </div>

            <button className={styles.arrowRight} onClick={nextSlide}>
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
}
