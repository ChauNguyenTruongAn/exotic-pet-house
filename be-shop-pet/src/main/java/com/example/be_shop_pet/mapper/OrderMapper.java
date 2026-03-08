package com.example.be_shop_pet.mapper;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.example.be_shop_pet.dtos.responses.CustomerDto;
import com.example.be_shop_pet.dtos.responses.OrderDetailResponseDto;
import com.example.be_shop_pet.dtos.responses.OrderResponseDto;
import com.example.be_shop_pet.dtos.responses.PromotionDto;
import com.example.be_shop_pet.model.Order;
import com.example.be_shop_pet.model.OrderDetail;
import com.example.be_shop_pet.model.OrderPromotion;
import com.example.be_shop_pet.model.User;

@Component
public class OrderMapper {

    public OrderResponseDto toOrderResponseDto(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .note(order.getNote())
                .status(order.getStatus())

                .customer(toCustomerDto(order.getUser()))
                .promotion(toPromotionDto(order.getPromotion()))

                .details(order.getDetails().stream()
                        .map(this::toOrderDetailDto)
                        .toList())

                .build();
    }

    private CustomerDto toCustomerDto(User user) {
        if (user == null)
            return null;

        return CustomerDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhoneNumber())
                .email(user.getEmail())
                .build();
    }

    private PromotionDto toPromotionDto(OrderPromotion promotion) {
        if (promotion == null)
            return null;

        return PromotionDto.builder()
                .promotionId(promotion.getId())
                .code(promotion.getCode())
                .name(promotion.getName())
                .type(promotion.getType())
                .value(promotion.getValue())
                .minimumOrder(promotion.getMinimumOrder())
                .maxDiscount(promotion.getMaxDiscount())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .build();
    }

    private OrderDetailResponseDto toOrderDetailDto(OrderDetail detail) {
        BigDecimal price = detail.getUnitPrice();
        int qty = detail.getQuantity();

        return OrderDetailResponseDto.builder()
                .productId(detail.getProduct().getId())
                .productName(detail.getProduct().getName())
                .imageUrl(detail.getProduct().getImageLink())
                .unitPrice(price)
                .quantity(qty)
                .lineTotal(price.multiply(BigDecimal.valueOf(qty)))
                .build();
    }
}
