package com.example.be_shop_pet.dtos.dashboard;


// DTO đơn giản để trả về
public class OrderStatusRate {
    private Double cancelledRate;
    private Double confirmedRate;

    public OrderStatusRate(Double cancelledRate, Double confirmedRate) {
        this.cancelledRate = cancelledRate;
        this.confirmedRate = confirmedRate;
    }

    public Double getCancelledRate() {
        return cancelledRate;
    }

    public Double getConfirmedRate() {
        return confirmedRate;
    }
}