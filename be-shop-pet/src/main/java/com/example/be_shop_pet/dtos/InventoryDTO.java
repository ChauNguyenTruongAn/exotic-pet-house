package com.example.be_shop_pet.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {
    private Long maSanPham;
    private Integer soLuong;
    private String tenSanPham;
    private String moTa;
    private String anhMinhHoa;
    private BigDecimal giaBan;
    private Long maLoai;
}
