package com.example.be_shop_pet.dtos.interfaces;

import java.math.BigDecimal;

public interface TopProductDto {
    Long getProductId();

    String getProductName();

    String getImageUrl();

    Integer getTotalSold();

    BigDecimal getRevenue();
}
