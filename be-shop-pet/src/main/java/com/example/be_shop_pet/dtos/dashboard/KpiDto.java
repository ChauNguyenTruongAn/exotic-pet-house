package com.example.be_shop_pet.dtos.dashboard;

import java.math.BigDecimal;

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
public class KpiDto {
    BigDecimal todayRevenue;
    BigDecimal yesterdayRevenue;
    Integer todayOrders;
    Integer yesterdayOrders;
    Integer totalCustomer;
    Double cancelRate;
    Double confirmRate;
}
