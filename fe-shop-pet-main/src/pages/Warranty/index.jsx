import React from "react";
import styles from "./Warranty.module.scss";

const Warranty = () => {
    return (
        <div className={styles['wrapper']}>
            <h1 className={styles.title}>CHÍNH SÁCH BẢO HÀNH</h1>

            {/* A - Mua trực tiếp */}
            <section className={styles['section']}>
                <h2>A/ Dành cho khách mua trực tiếp tại shop.</h2>
                <p>
                    Các bạn vui lòng kiểm tra đủ số lượng, đúng loài và vật phẩm tặng kèm thật kỹ
                    cùng nhân viên của Shop trước khi ra về. Mọi vấn đề phát sinh sau khi mua hàng
                    trực tiếp không nằm trong phạm vi của CSBH này.
                </p>
            </section>

            {/* B - Nội thành */}
            <section className={styles['section']}>
                <h2>B/ Giao nhận Nội thành TP. HCM.</h2>
                <p>
                    Các bạn vui lòng kiểm tra đủ số lượng, đúng loài và vật phẩm tặng kèm
                    thật kỹ cùng SHIPPER.
                </p>
            </section>

            {/* C - Ngoại thành */}
            <section className={styles['section']}>
                <h2>C/ Giao nhận Ngoại thành.</h2>

                <ul>
                    <li>Các bạn vui lòng KHÔNG ĐỒNG KIỂM với Shipper.</li>
                    <li>
                        Nếu shipper gọi điện lại cho Shop xác nhận rằng bạn muốn xem hàng,
                        CSBH này sẽ không được áp dụng.
                    </li>
                    <li>
                        Thời gian được hưởng CSBH là <strong>6 tiếng</strong> kể từ khi app giao hàng
                        xác nhận bạn đã nhận hàng. Trễ hơn 6 tiếng → CSBH không hiệu lực.
                    </li>
                </ul>

                <h3>Yêu cầu QUAY VIDEO unbox hàng:</h3>
                <ul>
                    <li>Video rõ nét – quay xuyên suốt, không cắt ghép.</li>
                    <li>Quay đủ 6 góc hộp hàng trước khi mở.</li>
                    <li>Kiểm tra số lượng: đúng số lượng pet và quà tặng kèm.</li>
                    <li>
                        Kiểm tra chất lượng: quay cận cảnh tình trạng pet, loại pet, vật dụng tặng.
                    </li>
                    <li>
                        Nếu có lỗi/hư hại, quay rõ từng lỗi để Shop kiểm tra và hỗ trợ.
                    </li>
                </ul>
            </section>

            {/* I - Thiếu số lượng */}
            <section className={styles['section']}>
                <h2>Các trường hợp được bảo hành</h2>

                <h3>I. Thiếu số lượng pet / vật dụng</h3>

                <ul>
                    <li>
                        <strong>Pet/vật dụng có sẵn:</strong>
                        Shop gửi lại đúng số lượng và loại bạn thiếu → <strong>Freeship</strong>.
                    </li>
                    <li>
                        <strong>Không có sẵn:</strong>
                        <ul>
                            <li>
                                Bạn chọn loại khác → bù chênh lệch nếu có → Freeship.
                            </li>
                            <li>
                                Bạn đợi khi có hàng → Shop ưu tiên cho bạn → Freeship.
                            </li>
                            <li>
                                Bạn không muốn đổi và không muốn đợi → <strong>Refund</strong>.
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>

            {/* II - Sai loại / lỗi / chết */}
            <section className={styles['section']}>
                <h3>II. Pet sai loại / tật lỗi / chết — Vật dụng bị hư bể</h3>

                <ul>
                    <li>
                        <strong>Pet/vật dụng có sẵn:</strong>
                        Shop gửi lại đúng loại & số lượng bạn đặt.
                        Bạn đóng gói gửi lại pet/vật dụng lỗi cho shipper lúc nhận hàng mới → Freeship.
                    </li>

                    <li>
                        <strong>Không có sẵn:</strong>
                        <ul>
                            <li>
                                Bạn chọn loại khác → bù chênh lệch nếu có → Freeship.
                            </li>
                            <li>
                                Bạn đợi khi có hàng → Shop ưu tiên cho bạn → Freeship
                                (vẫn gửi trả lại hàng lỗi khi nhận hàng mới).
                            </li>
                            <li>
                                Không muốn đổi và không muốn đợi → <strong>Refund</strong>.
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Warranty;
