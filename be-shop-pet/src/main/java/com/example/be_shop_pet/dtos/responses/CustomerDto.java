package com.example.be_shop_pet.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class CustomerDto {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
}
