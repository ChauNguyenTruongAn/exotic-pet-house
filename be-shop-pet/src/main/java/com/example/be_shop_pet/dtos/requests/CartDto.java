package com.example.be_shop_pet.dtos.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartDto {
    private Long productId;
    private Integer quantity;
}
