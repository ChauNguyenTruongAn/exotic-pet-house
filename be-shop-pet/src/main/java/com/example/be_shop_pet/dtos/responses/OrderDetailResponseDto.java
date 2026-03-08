package com.example.be_shop_pet.dtos.responses;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponseDto {
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal lineTotal;
}
