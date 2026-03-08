import styles from './Promotion.module.scss';

export default function Promotion() {
    const promotions = [
        {
            img: "/src/assets/images/so7.jpg",
            title: "Giảm 20% tất cả các loài bò sát",
            desc: "Áp dụng cho toàn bộ rắn, thằn lằn và gecko. Số lượng có hạn.",
            discount: "20%",
            expire: "Hết hạn: 30/12/2025",
        },
        {
            img: "/src/assets/images/so8.jpg",
            title: "Mua 2 tặng 1 – Isopod & Bọ Cánh Cứng",
            desc: "Ưu đãi dành riêng cho khách hàng mới.",
            discount: "Mua 2 Tặng 1",
            expire: "Hết hạn: 15/01/2026",
        },
        {
            img: "/src/assets/images/so9.jpg",
            title: "Flash Sale cuối tuần – Nhện cảnh",
            desc: "Giảm giá mạnh nhiều dòng Tarantula.",
            discount: "Giảm sốc",
            expire: "Chỉ 2 ngày duy nhất",
        },
    ];

    const coupons = [
        { code: "NFSALE20", desc: "Giảm 20% toàn bộ phụ kiện", expire: "31/12/2025" },
        { code: "HOTDEAL30", desc: "Giảm 30% khi mua từ 500.000đ", expire: "15/01/2026" },
        { code: "FREESHIP", desc: "Miễn phí ship đơn từ 300.000đ", expire: "Luôn áp dụng" },
    ];

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert("Đã sao chép mã: " + code);
    };

    return (
        <div className={styles["promotion-wrapper"]}>
            {/* Banner */}
            <div className={styles["banner"]}>
                <h1>KHUYẾN MÃI & ƯU ĐÃI HOT</h1>
                <p>Săn deal cực mạnh – Giá cực mềm – Hàng cực chất!</p>
            </div>

            {/* Promotions List */}
            <div className={styles["promo-list"]}>
                {promotions.map((item, index) => (
                    <div key={index} className={styles["promo-card"]}>
                        <img src={item.img} alt={item.title} />
                        <div className={styles["info"]}>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <span className={styles["discount"]}>{item.discount}</span>
                            <small>{item.expire}</small>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coupons */}
            <h2 className={styles["coupon-title"]}>Mã Giảm Giá Đặc Biệt</h2>
            <div className={styles["coupon-list"]}>
                {coupons.map((item, index) => (
                    <div key={index} className={styles["coupon-card"]}>
                        <div>
                            <h3>{item.code}</h3>
                            <p>{item.desc}</p>
                            <small>Hạn: {item.expire}</small>
                        </div>
                        <button onClick={() => copyCode(item.code)}>
                            Sao chép
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
