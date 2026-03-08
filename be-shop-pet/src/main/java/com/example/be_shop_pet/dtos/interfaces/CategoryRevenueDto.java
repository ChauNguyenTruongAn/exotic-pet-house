package com.example.be_shop_pet.dtos.interfaces;

import java.math.BigDecimal;

public interface CategoryRevenueDto {
    String getCategoryName();

    BigDecimal getRevenue();

    Integer getOrderCount();
}