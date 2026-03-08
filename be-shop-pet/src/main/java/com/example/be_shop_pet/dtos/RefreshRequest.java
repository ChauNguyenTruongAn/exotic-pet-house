package com.example.be_shop_pet.dtos;

import lombok.Builder;
import lombok.Data;

// DTO cho request refresh
@Data
@Builder
public class RefreshRequest {
    private String refreshToken;
}