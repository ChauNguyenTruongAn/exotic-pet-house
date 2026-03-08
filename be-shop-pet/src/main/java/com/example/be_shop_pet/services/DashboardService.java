package com.example.be_shop_pet.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.dashboard.*;
import com.example.be_shop_pet.dtos.interfaces.CategoryRevenueDto;
import com.example.be_shop_pet.dtos.interfaces.OrderStatusCount;
import com.example.be_shop_pet.dtos.interfaces.TopProductDto;
import com.example.be_shop_pet.repo.DashboardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    // Helper: Tính khoảng thời gian dựa trên period
    private Map<String, LocalDate> getDateRange(String period, LocalDate startDate, LocalDate endDate) {
        LocalDate start, end;

        if ("CUSTOM".equals(period) && startDate != null && endDate != null) {
            start = startDate;
            end = endDate;
        } else {
            LocalDate today = LocalDate.now();
            switch (period.toUpperCase()) {
                case "TODAY":
                    start = today;
                    end = today;
                    break;
                case "YESTERDAY":
                    start = today.minusDays(1);
                    end = today.minusDays(1);
                    break;
                case "WEEK":
                    start = today.with(DayOfWeek.MONDAY);
                    end = today.with(DayOfWeek.SUNDAY);
                    break;
                case "MONTH":
                    start = today.withDayOfMonth(1);
                    end = today.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "QUARTER":
                    int currentMonth = today.getMonthValue();
                    int startMonth = ((currentMonth - 1) / 3) * 3 + 1;
                    start = LocalDate.of(today.getYear(), startMonth, 1);
                    end = start.plusMonths(2).with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "YEAR":
                    start = today.withDayOfYear(1);
                    end = today.with(TemporalAdjusters.lastDayOfYear());
                    break;
                default:
                    start = today.with(DayOfWeek.MONDAY);
                    end = today.with(DayOfWeek.SUNDAY);
            }
        }

        return Map.of("start", start, "end", end);
    }

    // Helper: Tính khoảng thời gian trước đó (để so sánh)
    private Map<String, LocalDate> getPreviousPeriod(LocalDate start, LocalDate end) {
        long days = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
        LocalDate prevEnd = start.minusDays(1);
        LocalDate prevStart = prevEnd.minusDays(days - 1);
        return Map.of("start", prevStart, "end", prevEnd);
    }

    // Lấy KPIs với so sánh kỳ trước
    public KpiComparisonDto getKpisWithComparison(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, LocalDate> currentRange = getDateRange(period, startDate, endDate);
        Map<String, LocalDate> previousRange = getPreviousPeriod(currentRange.get("start"), currentRange.get("end"));

        // Dữ liệu kỳ hiện tại
        BigDecimal currentRevenue = getRevenueByRange(currentRange.get("start"), currentRange.get("end"));
        Integer currentOrders = getOrdersByRange(currentRange.get("start"), currentRange.get("end"));

        // Dữ liệu kỳ trước
        BigDecimal previousRevenue = getRevenueByRange(previousRange.get("start"), previousRange.get("end"));
        Integer previousOrders = getOrdersByRange(previousRange.get("start"), previousRange.get("end"));

        // Tính % thay đổi
        Double revenueChange = calculatePercentageChange(previousRevenue, currentRevenue);
        Double ordersChange = calculatePercentageChange(
                BigDecimal.valueOf(previousOrders != null ? previousOrders : 0),
                BigDecimal.valueOf(currentOrders != null ? currentOrders : 0));

        // Các metrics khác
        Integer totalCustomers = dashboardRepository.getTotalUser();
        Map<String, Double> rates = getOrderRates(currentRange.get("start"), currentRange.get("end"));

        return KpiComparisonDto.builder()
                .currentRevenue(currentRevenue != null ? currentRevenue : BigDecimal.ZERO)
                .previousRevenue(previousRevenue != null ? previousRevenue : BigDecimal.ZERO)
                .revenueChange(revenueChange)
                .currentOrders(currentOrders != null ? currentOrders : 0)
                .previousOrders(previousOrders != null ? previousOrders : 0)
                .ordersChange(ordersChange)
                .totalCustomers(totalCustomers != null ? totalCustomers : 0)
                .cancelRate(rates.get("cancel"))
                .confirmRate(rates.get("confirm"))
                .period(period)
                .startDate(currentRange.get("start"))
                .endDate(currentRange.get("end"))
                .build();
    }

    // Tính % thay đổi
    private Double calculatePercentageChange(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    // Lấy doanh thu theo range
    private BigDecimal getRevenueByRange(LocalDate start, LocalDate end) {
        return dashboardRepository.getProfitByDateRange(
                start.atStartOfDay().toString(),
                end.atTime(LocalTime.MAX).toString());
    }

    // Lấy số đơn hàng theo range
    private Integer getOrdersByRange(LocalDate start, LocalDate end) {
        return dashboardRepository.getTotalOrdersByDateRange(
                start.atStartOfDay().toString(),
                end.atTime(LocalTime.MAX).toString());
    }

    // Lấy tỉ lệ hủy và xác nhận
    private Map<String, Double> getOrderRates(LocalDate start, LocalDate end) {
        var rates = dashboardRepository.getOrderStatusRatesByDateRange(
                start.atStartOfDay().toString(),
                end.atTime(LocalTime.MAX).toString());
        return Map.of(
                "cancel", rates != null && rates.getCancelledRate() != null ? rates.getCancelledRate() : 0.0,
                "confirm", rates != null && rates.getConfirmedRate() != null ? rates.getConfirmedRate() : 0.0);
    }

    // Lấy doanh thu theo period với chi tiết từng ngày/tuần/tháng
    public List<RevenueDto> getRevenueByPeriod(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, LocalDate> range = getDateRange(period, startDate, endDate);
        LocalDate start = range.get("start");
        LocalDate end = range.get("end");

        List<RevenueDto> revenues = new ArrayList<>();
        LocalDate current = start;

        while (!current.isAfter(end)) {
            BigDecimal revenue = getRevenueByRange(current, current);
            revenues.add(new RevenueDto(
                    current.atStartOfDay().toInstant(ZoneOffset.UTC),
                    revenue != null ? revenue : BigDecimal.ZERO));
            current = current.plusDays(1);
        }

        return revenues;
    }

    // Lấy order status count theo thời gian
    public List<OrderStatusCount> getOrderStatusCount(String period, LocalDate startDate, LocalDate endDate) {
        if ("ALL".equals(period)) {
            return dashboardRepository.getOrderStatusCount();
        }

        Map<String, LocalDate> range = getDateRange(period, startDate, endDate);
        return dashboardRepository.getOrderStatusCountByDateRange(
                range.get("start").atStartOfDay().toString(),
                range.get("end").atTime(LocalTime.MAX).toString());
    }

    // Lấy sản phẩm sắp hết hàng
    public List<LowStockProduct> getLowStockProducts(Integer threshold) {
        Pageable pageable = PageRequest.of(0, 10); // Lấy 10 sản phẩm đầu tiên
        return dashboardRepository.findLowStockProducts(threshold, pageable);
    }

    // Lấy đơn hàng gần đây
    public List<RecentOrderDto> getRecentOrders(Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return dashboardRepository.getRecentOrders(pageable);
    }

    // Top sản phẩm bán chạy
    public List<TopProductDto> getTopProducts(String period, LocalDate startDate, LocalDate endDate, Integer limit) {
        Map<String, LocalDate> range = getDateRange(period, startDate, endDate);
        Pageable pageable = PageRequest.of(0, limit);
        return dashboardRepository.getTopSellingProducts(
                range.get("start").atStartOfDay().toString(),
                range.get("end").atTime(LocalTime.MAX).toString(),
                pageable);
    }

    // Doanh thu theo danh mục
    public List<CategoryRevenueDto> getRevenueByCategory(String period, LocalDate startDate, LocalDate endDate) {
        Map<String, LocalDate> range = getDateRange(period, startDate, endDate);
        return dashboardRepository.getRevenueByCategory(
                range.get("start").atStartOfDay().toString(),
                range.get("end").atTime(LocalTime.MAX).toString());
    }
}