-- =============== NGƯỜI DÙNG ===============
INSERT INTO nguoi_dung (ho_ten, sdt, email, mat_khau, dia_chi, vai_tro) VALUES
('Admin', '0912345678', 'admin@admin.com',
'$2a$10$qRKnxuUMMuE24YvB3uqGE.caLmfWBv02JEwtse3ZwBqOie47Iv4Ve', 'HCM', 'ADMIN'),

('Nguyễn Văn A', '0901111222', 'a@gmail.com', '123456', 'Hà Nội', 'USER'),
('Trần Thị B', '0902222333', 'b@gmail.com', '123456', 'Đà Nẵng', 'USER'),
('Lê Văn C', '0903333444', 'c@gmail.com', '123456', 'HCM', 'USER');
-- ============================
-- TABLE: danh_muc
-- ============================

INSERT INTO danh_muc (ten_danh_muc) VALUES
('Kiến'),
('Côn trùng và Chân khớp'),
('Bò sát'),
('Lưỡng cư'),
('Phụ kiện'),
('Thời trang');


-- ============================
-- TABLE: loai
-- ============================

INSERT INTO loai (ten_loai, ma_danh_muc) VALUES
('Kiến ăn thịt', 1),
('Kiến ăn hạt', 1),
('Tank nuôi kiến', 1),

('Bọ sát thủ', 2),
('Bọ cánh cứng', 2),
('Nhện', 2),
('Bọ cạp', 2),

('Rắn', 3),
('Thằn Lằn', 3),
('Rùa', 3),

('Ếch', 4),
('Phụ kiện Rùa', 4),

('Chén nước', 5),
('Tank mica', 5),

('Áo Thèm Kiến', 6),
('Nón Thèm Kiến', 6);


-- ============================
-- TABLE: san_pham
-- ============================

INSERT INTO san_pham (ma_loai, ten_san_pham, mo_ta, anh_minh_hoa, gia_ban) VALUES
-- 1
(8, 'Corn Snake 67 Tesserra Cái 20-30cm',
 'Rắn Corn Snake size 20-30cm',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316967/Shoppet/oe22wiinfwiuo2gzzgfa.jpg',
 1590000),

-- 2
(9, 'Black night Leopard gecko size 10cm (Female)',
 'Thằn Lằn Leopard Gecko',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316968/Shoppet/rfmjhaqlichfucvfshqw.jpg',
 12990000),

-- 3
(9, 'Tegu Black and White 20-25cm Unsex',
 'Thằn Lằn Tegu Black & White',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316967/Shoppet/ud6voj1t5aahtuknltvo.jpg',
 5490000),

-- 4
(4, 'Bọ sát thủ',
 'Bọ sát thủ cho côn trùng',
 'https://bizweb.dktcdn.net/thumb/medium/100/483/192/products/web.png?v=1682657057673',
 150000),

-- 5
(5, 'Bọ cánh cứng',
 'Bọ cánh cứng thu thập',
 'https://bizweb.dktcdn.net/thumb/medium/100/483/192/products/sung-y.jpg?v=1744951815353',
 120000),

-- 6
(15, 'Áo Thèm Kiến',
 'Áo Thun Thèm Kiến',
 'https://bizweb.dktcdn.net/thumb/medium/100/483/192/products/web-1-df19e964-1a60-48da-8ad3-33ad50ca8f38.png?v=1705026262983',
 350000),

-- 7
(16, 'Nón Thèm Kiến',
 'Nón Thèm Kiến',
 'https://bizweb.dktcdn.net/thumb/medium/100/483/192/products/web-6ec2909a-2fcf-49c5-b1a7-a4eacb47137b.png?v=1705026215407',
 150000),

-- 8
(11, 'Fantasy pacman hybrid size 3-4 cm',
 'Chacoan horned frog – ếch dễ nuôi, thân thiện, thích hợp cho người mới.',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316964/Shoppet/obnedl4eepcp86wwmlrc.jpg',
 350000),

-- 9
(11, 'Litoria caerulea (White tree frog) size 2-3cm',
 'White\'s tree frog thân thiện, ít nhát, mũm mĩm và dễ chăm sóc.',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316963/Shoppet/yjq5yubr76azi3wr0e94.jpg',
 299000),

-- 10
(10, 'Rùa đá size 10 - 15 cm',
 'Rùa nước đá, sống dưới nước.',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316965/Shoppet/rsqla7fpe6pkjqr3buey.jpg',
 50000),

-- 11
(10, 'Rùa vàng mắt đỏ size 5 - 10 cm',
 'Rùa vàng mắt đỏ hiếm và giá trị.',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316965/Shoppet/sc1jzhf7jlftlfypn0t3.jpg',
 200000),

-- 12
(8, 'Rắn ngô 20 - 30 cm',
 'Rắn ngô phổ biến, dễ nuôi và thân thiện.',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316966/Shoppet/xi1f3chdzc9v5n8wuwkp.jpg',
 2100000),

-- 13
(8, 'Corn Snake 78 Amel Cái 20-30cm',
 NULL,
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316966/Shoppet/o8sr15jejxrre3nxjcgw.jpg',
 2599000),

-- 14
(9, 'LG mã 460 Mack Snow 20-22cm Cái',
 NULL,
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316968/Shoppet/rfmjhaqlichfucvfshqw.jpg',
 900000),

-- 15
(9, 'LG mã 456 Sunglow 10-14cm UNSEX',
 NULL,
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316968/Shoppet/aodupatly4ptq4ycmhhb.jpg',
 750000),

-- 16
(6, 'Avicularia sp Perupurple 2-3cm',
 'Nhện kiểng màu tím',
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316971/Shoppet/pcyjsayidugwx7vldmzv.jpg',
 499000),

-- 17
(7, 'Bọ cạp đen',
 NULL,
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316971/Shoppet/wzo5u6si5tg4zg0xtmxb.jpg',
 2000000),

-- 18
(7, 'Bọ cạp vàng',
 NULL,
 'https://res.cloudinary.com/petrol-user/image/upload/v1733316972/Shoppet/hd3j5pdzkctxrsfa08y2.jpg',
 2100000);
