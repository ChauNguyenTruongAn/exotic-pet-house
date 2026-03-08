package com.example.be_shop_pet.dtos.requests;

import java.math.BigDecimal;
import java.util.List;

import com.example.be_shop_pet.utils.PaymentMethod;
import com.example.be_shop_pet.utils.PaymentStatus;

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

public class OrderCreateRequestDto {
    private Long customerId;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String district;
    private String province;
    private String ward;
    private String note;
    private String methodDelivery;
    private BigDecimal deliveryFee;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String promotionCode;
    private List<OrderDetailDto> cart;
}
