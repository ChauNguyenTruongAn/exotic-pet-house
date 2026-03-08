import styles from './About.module.scss';

export default function About() {
    return (
        <div className={styles['about-wrapper']}>

            {/* ======= GIỚI THIỆU ======= */}
            <section className={styles['intro']}>
                <h1 className={styles['title']}>
                    🐲 Night Fury Exotic Zone – Khám Phá Thế Giới Động Vật Kỳ Lạ
                </h1>

                <p>
                    Night Fury Exotic Zone là điểm đến lý tưởng, nơi hội tụ những người trẻ có chung niềm đam mê
                    với các loài động vật độc đáo như: côn trùng, chân khớp, kiến, lưỡng cư, bò sát, và nhiều loài vật kỳ lạ khác.
                </p>

                <p>
                    Đến với Night Fury, bạn sẽ được chiêm ngưỡng tận mắt những sinh vật thú vị mà trước đây chỉ thấy trên màn ảnh.
                    Bạn còn được hướng dẫn thực hành tận tay bởi đội ngũ nhân viên có hơn 5 năm kinh nghiệm.
                    Chúng tôi cam kết cung cấp đầy đủ kiến thức và vật dụng chăm sóc an toàn cho bạn.
                </p>

                <p>
                    Thành lập ngày 23/03/2019, Night Fury Exotic Zone tự hào là một trong những đơn vị tiên phong
                    mang khái niệm "Exotic Pet" về Việt Nam.
                    Chúng tôi đã nuôi sống và nhân giống thành công nhiều loài hiếm như:
                    Bọ sát thủ, Bọ cạp sa mạc, Nhện cảnh, và đặc biệt là Kingsnake Highwhite đầu tiên tại Việt Nam.
                </p>

                <p>
                    Night Fury hân hạnh đón tiếp hàng trăm lượt khách mỗi ngày và xuất hiện trên nhiều báo lớn:
                    Thanh Niên, Tuổi Trẻ, Dân Trí, VN Express, Vietnam.net cùng nhiều chuyên gia và creator nổi tiếng.
                </p>

                <p>
                    Chúng tôi cũng là đơn vị tài trợ và đồng tổ chức nhiều sự kiện lớn:
                    Thi ảnh Rắn đẹp 2021, Happy Halloween 2021, Hoa hậu Isopod 2022, Sneaker Head 2022,
                    và Thèm Kiến 2023.
                </p>

                <p>
                    Night Fury Exotic Zone luôn nỗ lực hoàn thiện để mang đến nhiều loài thú vị hơn,
                    lan tỏa tình yêu động vật đúng cách và an toàn.
                </p>

                <p>
                    Mọi thắc mắc vui lòng liên hệ Hotline: <strong>0939.963.568</strong>.
                    <br />Night Fury Exotic Zone chân thành cảm ơn!
                </p>
            </section>


            {/* ======= 1. CHUẨN BỊ MÔI TRƯỜNG SỐNG ======= */}
            <section className={styles['section']}>
                <h2 className={styles['section-title']}>1. Chuẩn bị Môi trường Sống (Chuồng / Bể nuôi)</h2>

                <div className={styles['qa-box']}>
                    <h3>Loài tôi chọn cần loại chuồng như thế nào?</h3>
                    <p>
                        Chuồng phải đủ rộng, có nơi ẩn nấp và nắp đậy chắc chắn.
                        Cần hệ thống thông gió tốt, đặc biệt với rắn và bò cạp.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Nhiệt độ và độ ẩm lý tưởng là bao nhiêu?</h3>
                    <p>
                        Vùng sưởi 30–40°C tùy loài, vùng mát thấp hơn.
                        Độ ẩm dao động 40–90% tùy môi trường tự nhiên của loài.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Tôi cần loại đèn nào?</h3>
                    <p>
                        Loài ban ngày: cần UVB + sưởi.
                        Loài ban đêm: chỉ cần sưởi, không cần UVB.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Vật liệu lót nền an toàn?</h3>
                    <p>
                        Giấy báo, khăn giấy, dừa nén, cát sa mạc.
                        Tránh mùn cưa thông và tuyết tùng.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Có cần đồ trang trí hay nơi ẩn nấp?</h3>
                    <p>
                        Tối thiểu 2 nơi ẩn nấp: vùng ấm và vùng mát.
                        Một số loài cần bát nước lớn để ngâm mình.
                    </p>
                </div>
            </section>


            {/* ======= 2. DINH DƯỠNG ======= */}
            <section className={styles['section']}>
                <h2 className={styles['section-title']}>2. Dinh dưỡng và Chăm sóc</h2>

                <div className={styles['qa-box']}>
                    <h3>Thức ăn chính của loài?</h3>
                    <p>
                        Rắn: chuột/ chim đông lạnh.
                        Thằn lằn: côn trùng sống + rau củ.
                        Ếch / Bò cạp / Rết: côn trùng sống.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Tần suất cho ăn?</h3>
                    <p>
                        Rắn: 1 lần mỗi 1–3 tuần.
                        Thằn lằn/ếch non: hàng ngày hoặc cách ngày.
                        Trưởng thành: 1–3 lần/tuần.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Bổ sung vitamin & canxi?</h3>
                    <p>
                        Loài ăn côn trùng: cần canxi thường xuyên, vitamin 1–2 lần/tuần.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Nên cho ăn lúc nào?</h3>
                    <p>
                        Ban ngày: cho ăn sáng.
                        Ban đêm: cho ăn tối / đêm.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Có cần nước uống?</h3>
                    <p>
                        Bò sát uống từ bát.
                        Lưỡng cư hấp thụ qua da → cần độ ẩm cao.
                    </p>
                </div>
            </section>


            {/* ======= 3. SỨC KHỎE ======= */}
            <section className={styles['section']}>
                <h2 className={styles['section-title']}>3. Sức khỏe và Hành vi</h2>

                <div className={styles['qa-box']}>
                    <h3>Dấu hiệu bệnh?</h3>
                    <p>
                        Chán ăn, lờ đờ, sụt cân, lột da không hoàn chỉnh, thở bằng miệng.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Lột da diễn ra thế nào?</h3>
                    <p>
                        Tự nhiên. Nếu da bị dính → tăng độ ẩm và có thể ngâm nước ấm.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Loài nuôi có độc không?</h3>
                    <p>
                        Phần lớn loài cảnh là không độc hoặc độc nhẹ.
                        Loài độc cần kinh nghiệm & giấy phép.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Vệ sinh chuồng?</h3>
                    <p>
                        Rửa tay kỹ, thay lót nền định kỳ, khử trùng thường xuyên.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Tuổi thọ?</h3>
                    <p>
                        Tắc kè 10–20 năm, rắn 15–30 năm, rùa 30–100+ năm, bò cạp 3–8 năm.
                    </p>
                </div>
            </section>


            {/* ======= 4. AN TOÀN ======= */}
            <section className={styles['section']}>
                <h2 className={styles['section-title']}>4. An toàn và Quy định</h2>

                <div className={styles['qa-box']}>
                    <h3>Có cần giấy phép?</h3>
                    <p>
                        Một số loài cần kiểm tra luật pháp địa phương, đặc biệt loài hoang dã hoặc có độc.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Cách xử lý khi cầm nắm?</h3>
                    <p>
                        Không chạm rắn độc.
                        Loài hiền: đỡ cả cơ thể.
                        Bò cạp / Rết: dùng nhíp hoặc hộp.
                    </p>
                </div>

                <div className={styles['qa-box']}>
                    <h3>Nếu bị cắn?</h3>
                    <p>
                        Không độc: rửa sạch.
                        Có độc: gọi cấp cứu ngay và ghi nhận đặc điểm loài.
                    </p>
                </div>
            </section>
        </div>
    );
}
