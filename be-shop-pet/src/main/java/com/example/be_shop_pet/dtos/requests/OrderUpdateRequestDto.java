package com.example.be_shop_pet.dtos.requests;

import com.example.be_shop_pet.utils.OrderStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateRequestDto {
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
