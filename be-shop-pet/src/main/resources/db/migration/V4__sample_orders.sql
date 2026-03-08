INSERT INTO hoa_don (ma_khach_hang, ngay_ban, tong_tien, trang_thai, ghi_chu)
VALUES
(2, NOW(), 1590000, 'CONFIRMED', 'Mua 1 Corn Snake 67'),
(3, NOW(), 299000, 'DELIVERED', 'Mua ếch tree frog'),
(4, NOW(), 2150000, 'SHIPPED', 'Mua rùa + phụ kiện'),
(3, NOW(), 499000, 'PENDING', 'Mua nhện Perupurple'),
(2, NOW(), 2600000, 'CANCELLED', 'Khách hủy đơn rắn ngô');

-- Hóa đơn của khách 2 – Corn Snake 67
INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 1, 1, 1590000
FROM hoa_don h
WHERE h.ma_khach_hang = 2 AND h.ghi_chu = 'Mua 1 Corn Snake 67'
LIMIT 1;


-- Hóa đơn khách 3 – White Tree Frog
INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 9, 1, 299000
FROM hoa_don h
WHERE h.ma_khach_hang = 3 AND h.ghi_chu = 'Mua ếch tree frog'
LIMIT 1;


-- Hóa đơn khách 4 – Rùa + phụ kiện
INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 10, 1, 50000
FROM hoa_don h
WHERE h.ma_khach_hang = 4 AND h.ghi_chu = 'Mua rùa + phụ kiện'
LIMIT 1;

INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 11, 1, 200000
FROM hoa_don h
WHERE h.ma_khach_hang = 4 AND h.ghi_chu = 'Mua rùa + phụ kiện'
LIMIT 1;

INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 12, 1, 2100000
FROM hoa_don h
WHERE h.ma_khach_hang = 4 AND h.ghi_chu = 'Mua rùa + phụ kiện'
LIMIT 1;


-- Hóa đơn khách 5 – Nhện Perupurple
INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 16, 1, 499000
FROM hoa_don h
WHERE h.ma_khach_hang = 3 AND h.ghi_chu = 'Mua nhện Perupurple'
LIMIT 1;


-- Hóa đơn khách 6 – Hủy đơn rắn ngô
INSERT INTO chi_tiet_hoa_don (ma_hoa_don, ma_san_pham, so_luong, don_gia)
SELECT h.ma_hoa_don, 12, 1, 2100000
FROM hoa_don h
WHERE h.ma_khach_hang = 2 AND h.ghi_chu = 'Khách hủy đơn rắn ngô'
LIMIT 1;
