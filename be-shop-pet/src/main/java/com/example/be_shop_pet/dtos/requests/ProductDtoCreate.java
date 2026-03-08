package com.example.be_shop_pet.dtos.requests;

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
public class ProductDtoCreate {

    private String name;

    private String description;

    private String imageLink;

    private BigDecimal price;

    private Long speciesId;
}
