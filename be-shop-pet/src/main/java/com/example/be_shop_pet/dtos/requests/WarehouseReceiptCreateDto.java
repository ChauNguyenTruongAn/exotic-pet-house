package com.example.be_shop_pet.dtos.requests;

import java.time.Instant;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseReceiptCreateDto {

    private Instant receiveTime;
    private String note;
    private List<WarehouseReceiptDetailCreateDto> details;
}
