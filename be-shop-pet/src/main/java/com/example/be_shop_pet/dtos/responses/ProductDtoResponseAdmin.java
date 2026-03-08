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
public class ProductDtoResponseAdmin {
    private Long id;
    private Integer quantityInventory;
    private Long speciesId;
    private String name;
    private String description;
    private String imageLink;
    private BigDecimal price;
}
