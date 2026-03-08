package com.example.be_shop_pet.dtos.responses;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.example.be_shop_pet.utils.OrderStatus;

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
public class OrderResponseDto {
    private Long orderId;
    private Instant orderDate;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount;

    private String note;
    private OrderStatus status;

    private CustomerDto customer;
    private PromotionDto promotion;

    private String paymentLink;

    private List<OrderDetailResponseDto> details;
}
