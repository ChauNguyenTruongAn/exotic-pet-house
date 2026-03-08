package com.example.be_shop_pet.model.EmbeddedId;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseReceiptDetailId implements Serializable {
    @Column(name = "ma_phieu_nhap")
    private Long receiptId;
    @Column(name = "ma_san_pham")
    private Long productId;
}
