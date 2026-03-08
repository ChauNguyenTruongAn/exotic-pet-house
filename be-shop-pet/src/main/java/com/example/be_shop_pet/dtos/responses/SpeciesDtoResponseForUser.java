package com.example.be_shop_pet.dtos.responses;

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
public class SpeciesDtoResponseForUser {
    private Long id;
    private Long categoryId;
    private String name;
}
