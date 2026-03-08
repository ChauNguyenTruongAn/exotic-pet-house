package com.example.be_shop_pet.dtos.interfaces;

import java.math.BigDecimal;

public interface DetailReceiptDto {
    Long getMaPhieuNhap();

    Long getMaSanPham();

    BigDecimal getGiaNhap();

    String getTenSanPham();

    String getMoTa();

    String getAnhMinhHoa();

    Integer getSoLuong();
}
