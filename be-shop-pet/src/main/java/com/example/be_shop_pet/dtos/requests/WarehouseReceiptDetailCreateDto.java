package com.example.be_shop_pet.dtos.requests;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseReceiptDetailCreateDto {
    private Long productId;
    private int quantity;
}
