package com.example.be_shop_pet.dtos.requests;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailProductDto {
    private Long id;
    private String name;
    private String imageLink;
    private String description;
    private BigDecimal prBigDecimal;
}
