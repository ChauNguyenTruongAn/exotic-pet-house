package com.example.be_shop_pet.dtos.filters;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterDto {
    private String name;
    private List<String> priceRange = new ArrayList<>();
    private List<Long> speciesIds = new ArrayList<>();
    private Long categoryId;
}
