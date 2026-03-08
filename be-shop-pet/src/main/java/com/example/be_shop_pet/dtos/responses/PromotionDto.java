package com.example.be_shop_pet.dtos.responses;

import java.math.BigDecimal;
import java.time.Instant;

import com.example.be_shop_pet.utils.PromotionType;

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
public class PromotionDto {
    private Long promotionId;
    private String code;
    private String name;
    private PromotionType type;
    private BigDecimal value;
    private BigDecimal minimumOrder;
    private BigDecimal maxDiscount;
    private Instant startDate;
    private Instant endDate;
}
