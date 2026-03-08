package com.example.be_shop_pet.dtos.requests;

import com.fasterxml.jackson.annotation.JsonAlias;

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
public class WarehouseDetailDtoUpdate {
    @JsonAlias("maSanPham")
    private Long productId;
    @JsonAlias("maSanPhamMoi")
    private Long newpPoductId;
    @JsonAlias("maPhieuNhap")
    private Long receiptId;
    @JsonAlias("soLuong")
    private int quantity;
}