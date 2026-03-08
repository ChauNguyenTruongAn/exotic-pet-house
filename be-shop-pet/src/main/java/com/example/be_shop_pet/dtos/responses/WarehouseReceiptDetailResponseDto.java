package com.example.be_shop_pet.dtos.responses;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WarehouseReceiptDetailResponseDto {
    private Long productId;
    private String productName;
    private int quantity;
}
