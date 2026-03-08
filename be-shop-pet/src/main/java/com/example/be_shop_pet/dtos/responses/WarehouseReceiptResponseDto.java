package com.example.be_shop_pet.dtos.responses;

import java.time.Instant;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WarehouseReceiptResponseDto {
    private Long id;
    private Instant receiveTime;
    private String note;

    private Long userId;
    private String userName;

    private List<WarehouseReceiptDetailResponseDto> details;
}
