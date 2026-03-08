package com.example.be_shop_pet.dtos.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface RecentOrderDto {
     Long getMaHoaDon();
    String getHoTen();
    BigDecimal getTongTien();
    String getTrangThai();
    LocalDateTime getNgayBan();
}
