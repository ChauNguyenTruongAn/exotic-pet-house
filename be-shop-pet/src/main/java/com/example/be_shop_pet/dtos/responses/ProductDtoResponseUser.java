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
public class ProductDtoResponseUser {
    
    private Long id;

    private String name;

    private String description;

    private String imageLink;

    private BigDecimal price;

    private Long speciesId;

    private Long categoryId;    

    private String speciesName;
    
    private String categoryName;
}
