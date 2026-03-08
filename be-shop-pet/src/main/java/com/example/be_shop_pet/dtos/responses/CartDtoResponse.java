package com.example.be_shop_pet.dtos.responses;

import com.example.be_shop_pet.model.Product;

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
public class CartDtoResponse {
    private Long id;
    private Product product;
    private Integer quantity;
}
