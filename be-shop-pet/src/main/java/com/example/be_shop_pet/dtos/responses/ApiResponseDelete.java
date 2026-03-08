package com.example.be_shop_pet.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDelete<T> {
    private int httpStatus;
    private String message;
    private boolean status;
}
