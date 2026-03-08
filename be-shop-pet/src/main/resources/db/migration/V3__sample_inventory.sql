-- ==========================================
-- PHIẾU NHẬP
-- ==========================================

INSERT INTO phieu_nhap (ngay_nhap, ma_nguoi_dung, ghi_chu)
VALUES
(NOW(), 1, 'Nhập hàng đợt 1 – bò sát & côn trùng'),
(NOW(), 1, 'Nhập hàng đợt 2 – quần áo & phụ kiện'),
(NOW(), 1, 'Nhập hàng đợt 3 – bổ sung hàng bán chạy');


-- ==========================================
-- CHI TIẾT PHIẾU NHẬP
-- ==========================================

INSERT INTO phieu_nhap_chi_tiet (ma_phieu_nhap, ma_san_pham, so_luong)
VALUES

-- ===========================
-- ĐỢT 1 – bò sát, rắn, thằn lằn, ếch
-- ===========================
(1, 1, 10),   -- Corn Snake 67
(1, 2, 5),    -- Leopard Gecko Black Night
(1, 3, 4),    -- Tegu Black White

(1, 8, 20),    -- Pacman Frog Hybrid
(1, 9, 25),    -- White Tree Frog

(1, 10, 40),    -- Rùa đá
(1, 11, 20),   -- Rùa vàng mắt đỏ

(1, 12, 6),   -- Rắn ngô 20-30cm
(1, 13, 4),   -- Corn Snake 78 Amel
(1, 14, 8),    -- LG Mack Snow
(1, 15, 8),    -- LG Sunglow

-- ===========================
-- ĐỢT 2 – thời trang, côn trùng & nhện/bọ cạp
-- ===========================
(2, 6, 30),    -- Áo Thèm Kiến
(2, 7, 30),     -- Nón Thèm Kiến

(2, 4, 50),     -- Bọ sát thủ
(2, 5, 40),     -- Bọ cánh cứng

(2, 16, 12),   -- Nhện Perupurple
(2, 17, 5),   -- Bọ cạp đen
(2, 18, 5),   -- Bọ cạp vàng

-- ===========================
-- ĐỢT 3 – nhập thêm hàng chạy
-- ===========================
(3, 1, 8),    -- Corn Snake 67
(3, 8, 15),    -- Pacman Hybrid
(3, 10, 30),    -- Rùa đá
(3, 6, 20),    -- Áo Thèm Kiến
(3, 4, 25);     -- Bọ sát thủ
