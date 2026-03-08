package com.example.be_shop_pet.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseDetailDeleteDto {
    private Long productId;
    private Long receiptId;
}
