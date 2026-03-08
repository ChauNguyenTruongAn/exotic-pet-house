
-- =============================
-- 1. DANH MỤC
-- =============================
CREATE TABLE danh_muc (
  ma_danh_muc BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_danh_muc VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- 2. NGƯỜI DÙNG
-- =============================
CREATE TABLE nguoi_dung (
  ma_nguoi_dung BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ho_ten VARCHAR(255) NOT NULL,
  sdt VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mat_khau VARCHAR(255) NOT NULL,
  dia_chi VARCHAR(255),
  vai_tro VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- 3. LOẠI SẢN PHẨM
-- =============================
CREATE TABLE loai (
  ma_loai BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ten_loai VARCHAR(255) NOT NULL,
  ma_danh_muc BIGINT UNSIGNED,
  FOREIGN KEY (ma_danh_muc) REFERENCES danh_muc(ma_danh_muc) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- 4. SẢN PHẨM
-- =============================
CREATE TABLE san_pham (
  ma_san_pham BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_loai BIGINT UNSIGNED,
  ten_san_pham VARCHAR(255) NOT NULL,
  mo_ta TEXT,
  anh_minh_hoa TEXT,
  gia_ban DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (ma_loai) REFERENCES loai(ma_loai) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================
-- 5. TỒN KHO
-- =============================
CREATE TABLE ton_kho (
  ma_san_pham BIGINT UNSIGNED PRIMARY KEY,
  so_luong INT NOT NULL DEFAULT 0,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger: Thêm sản phẩm → thêm tồn kho
DELIMITER $$
CREATE TRIGGER trg_them_san_pham
AFTER INSERT ON san_pham
FOR EACH ROW
BEGIN
  INSERT INTO ton_kho (ma_san_pham, so_luong)
  VALUES (NEW.ma_san_pham, 0);
END$$
DELIMITER ;

-- =============================
-- 6. PHIẾU NHẬP
-- =============================
CREATE TABLE phieu_nhap (
  ma_phieu_nhap BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ngay_nhap DATETIME NOT NULL,
  ma_nguoi_dung BIGINT UNSIGNED,
  ghi_chu TEXT,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE phieu_nhap_chi_tiet (
  ma_phieu_nhap BIGINT UNSIGNED,
  ma_san_pham BIGINT UNSIGNED,
  so_luong INT NOT NULL,
  PRIMARY KEY (ma_phieu_nhap, ma_san_pham),
  FOREIGN KEY (ma_phieu_nhap) REFERENCES phieu_nhap(ma_phieu_nhap) ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger nhập – tăng tồn
DELIMITER $$
CREATE TRIGGER trg_nhap_them
AFTER INSERT ON phieu_nhap_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong + NEW.so_luong
  WHERE ma_san_pham = NEW.ma_san_pham;
END$$
DELIMITER ;

-- Trigger sửa nhập
DELIMITER $$
CREATE TRIGGER trg_nhap_sua
BEFORE UPDATE ON phieu_nhap_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong - OLD.so_luong + NEW.so_luong
  WHERE ma_san_pham = OLD.ma_san_pham;
END$$
DELIMITER ;

-- Trigger xóa nhập
DELIMITER $$
CREATE TRIGGER trg_nhap_xoa
BEFORE DELETE ON phieu_nhap_chi_tiet
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong - OLD.so_luong
  WHERE ma_san_pham = OLD.ma_san_pham;
END$$
DELIMITER ;

-- =============================
-- 7. HÓA ĐƠN BÁN
-- =============================
CREATE TABLE hoa_don (
  ma_hoa_don BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_khach_hang BIGINT UNSIGNED,
  ngay_ban DATETIME NOT NULL,
  tong_tien DECIMAL(12,2),
  trang_thai ENUM('PENDING','SHIPPED','DELIVERED','CANCELLED', 'CONFIRMED', 'COMPLETED') DEFAULT 'PENDING',
  ghi_chu TEXT,
  trang_thai_thanh_toan ENUM('PENDING','PAID','REFUND') DEFAULT 'PENDING',
  phuong_thuc_thanh_toan ENUM('MOMO', 'VNPAY', 'COD') DEFAULT 'COD',
  FOREIGN KEY (ma_khach_hang) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chi_tiet_hoa_don (
  ma_chi_tiet BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_hoa_don BIGINT UNSIGNED,
  ma_san_pham BIGINT UNSIGNED,
  so_luong INT NOT NULL,
  don_gia DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (ma_hoa_don) REFERENCES hoa_don(ma_hoa_don) ON DELETE CASCADE,
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger xuất – trừ tồn
DELIMITER $$
CREATE TRIGGER trg_xuat_bot
AFTER INSERT ON chi_tiet_hoa_don
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong - NEW.so_luong
  WHERE ma_san_pham = NEW.ma_san_pham;
END$$
DELIMITER ;

-- Trigger sửa xuất
DELIMITER $$
CREATE TRIGGER trg_xuat_sua
BEFORE UPDATE ON chi_tiet_hoa_don
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong + OLD.so_luong - NEW.so_luong
  WHERE ma_san_pham = OLD.ma_san_pham;
END$$
DELIMITER ;

-- Trigger xóa xuất
DELIMITER $$
CREATE TRIGGER trg_xuat_xoa
BEFORE DELETE ON chi_tiet_hoa_don
FOR EACH ROW
BEGIN
  UPDATE ton_kho
  SET so_luong = so_luong + OLD.so_luong
  WHERE ma_san_pham = OLD.ma_san_pham;
END$$
DELIMITER ;

-- =============================
-- 8. KHUYẾN MÃI
-- =============================
CREATE TABLE khuyen_mai_don_hang (
  ma_khuyen_mai BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_code VARCHAR(50) UNIQUE,
  ten_khuyen_mai VARCHAR(255) NOT NULL,
  loai_khuyen_mai ENUM('PERCENT', 'AMOUNT') NOT NULL,
  gia_tri DECIMAL(10,2) NOT NULL,
  don_toi_thieu DECIMAL(12,2) DEFAULT 0,
  giam_toi_da DECIMAL(12,2) DEFAULT NULL,
  ngay_bat_dau DATETIME NOT NULL,
  ngay_ket_thuc DATETIME NOT NULL,
  so_lan_su_dung INT DEFAULT NULL,
  trang_thai ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE hoa_don
ADD COLUMN ma_khuyen_mai BIGINT UNSIGNED NULL,
ADD COLUMN so_tien_giam DECIMAL(12,2) DEFAULT 0,
ADD FOREIGN KEY (ma_khuyen_mai) REFERENCES khuyen_mai_don_hang(ma_khuyen_mai) ON DELETE SET NULL;

CREATE TABLE khuyen_mai_nguoi_dung (
  ma_khuyen_mai BIGINT UNSIGNED,
  ma_nguoi_dung BIGINT UNSIGNED,
  PRIMARY KEY (ma_khuyen_mai, ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE gio_hang(
  ma_gio_hang BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_dung BIGINT UNSIGNED,
  FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chi_tiet_gio_hang(
  ma_gio_hang BIGINT UNSIGNED NOT NULL,
  ma_san_pham BIGINT UNSIGNED NOT NULL,
  so_luong INT NOT NULL,
  PRIMARY KEY (ma_gio_hang, ma_san_pham),
  FOREIGN KEY (ma_gio_hang) REFERENCES gio_hang(ma_gio_hang),
  FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET time_zone = '+07:00';
