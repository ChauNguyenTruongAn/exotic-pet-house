INSERT INTO khuyen_mai_don_hang 
(ma_code, ten_khuyen_mai, loai_khuyen_mai, gia_tri, don_toi_thieu,
 giam_toi_da, ngay_bat_dau, ngay_ket_thuc, so_lan_su_dung, trang_thai)
VALUES
('SALE10', 'Giảm 10% toàn đơn', 'PERCENT', 10, 100000, 50000, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 30 DAY),
 NULL, 'ACTIVE'),

('FLASH50_EXPIRED', 'Giảm 50k - hết hạn', 'AMOUNT', 50000, 150000, NULL,
 DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 10 DAY),
 DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 1 DAY),
 NULL, 'INACTIVE'),

('SUPER20', 'Giảm 20% đơn lớn', 'PERCENT', 20, 300000, 80000, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 60 DAY),
 200, 'ACTIVE'),

('NEWUSER', 'Giảm 100k cho khách hàng mới', 'AMOUNT', 100000, 200000, NULL,
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 90 DAY),
 1, 'ACTIVE'),

('ENDMONTH', 'Khuyến mãi cuối tháng', 'PERCENT', 15, 500000, 120000,
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 15 DAY),
 NULL, 'INACTIVE'),

('MINIGAME', 'Khuyến mãi cuối tháng', 'PERCENT', 15, 500000, 120000,
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 15 DAY),
 NULL, 'INACTIVE'),

('MUNGBANMOI', 'Mã khuyến mãi cho người mới', 'PERCENT', 10, 100000, 50000, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 30 DAY),
 NULL, 'ACTIVE'),

('NFSALE20', 'Mã khuyến mãi vĩnh viễn', 'PERCENT', 20, 0, 20000, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 30 DAY),
 NULL, 'ACTIVE'),

('HOTDEAL30', 'Mã khuyến mãi vĩnh viễn', 'PERCENT', 30, 500000, 150000, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 30 DAY),
 NULL, 'ACTIVE'),

('FREESHIP', 'Mã khuyến mãi vĩnh viễn', 'AMOUNT', 35000, 0, NULL, 
 CONVERT_TZ(NOW(), '+00:00', '+07:00'),
 DATE_ADD(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 30 DAY),
 NULL, 'ACTIVE');
