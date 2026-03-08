package com.example.be_shop_pet.dtos.requests;

import java.math.BigDecimal;
import java.time.Instant;

import com.example.be_shop_pet.utils.PromotionStatus;
import com.example.be_shop_pet.utils.PromotionType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPromotionDtoUpdate {
    private String code;
    private String name;
    private PromotionType type;
    private BigDecimal value;
    private BigDecimal minimumOrder;
    private BigDecimal maxDiscount;
    private Instant startDate;
    private Instant endDate;
    private Integer maxUsage;
    private PromotionStatus status;
}
