package com.example.be_shop_pet.dtos.requests;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseDtoUpdate {

    private Instant receiveTime;

    private int quantity;

}
