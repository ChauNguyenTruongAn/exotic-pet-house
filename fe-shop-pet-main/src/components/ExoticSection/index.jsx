import React from "react";
import styles from "./ExoticSection.module.scss";
import { Link } from "react-router-dom";

const ExoticSection = ({ title, products }) => {
    const bigItem = products[0];              // Hình lớn bên trái
    const smallItems = products.slice(1);     // Các hình nhỏ bên phải

    return (
        <div className={styles['wrapper']}>
            <h2 className={styles['title']}>{title}</h2>

            <div className={styles['layout']}>

                {/* ==== HÌNH LỚN BÊN TRÁI ==== */}
                <Link
                    to={bigItem.link || `/products/${bigItem.id}`}
                    className={styles['bigCard']}
                >
                    <img src={bigItem.image} alt={bigItem.name} />
                    <h3 className={styles['bigTitle']}>{bigItem.name}</h3>
                </Link>

                {/* ==== GRID NHỎ BÊN PHẢI ==== */}
                <div className={styles['rightGrid']}>
                    {smallItems.map((item) => (
                        <Link
                            to={item.link || `/products/${item.id}`}
                            className={styles['card']}
                            key={item.id}
                        >
                            <div className={styles['imageBox']}>
                                <img src={item.image} alt={item.name} />
                            </div>

                            <h3 className={styles['name']}>{item.name}</h3>

                            {item.price && (
                                <p className={styles['price']}>
                                    {item.price.toLocaleString("vi-VN")}đ
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExoticSection;
