package com.example.be_shop_pet.dtos.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiComparisonDto {
    private BigDecimal currentRevenue;
    private BigDecimal previousRevenue;
    private Double revenueChange; // % thay đổi

    private Integer currentOrders;
    private Integer previousOrders;
    private Double ordersChange; // % thay đổi

    private Integer totalCustomers;
    private Double cancelRate;
    private Double confirmRate;

    private String period; // TODAY, WEEK, MONTH, QUARTER, YEAR, CUSTOM
    private LocalDate startDate;
    private LocalDate endDate;
}