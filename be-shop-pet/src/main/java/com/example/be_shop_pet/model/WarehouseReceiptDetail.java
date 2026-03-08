package com.example.be_shop_pet.model;


import com.example.be_shop_pet.model.EmbeddedId.WarehouseReceiptDetailId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
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
@Entity
@Table(name="phieu_nhap_chi_tiet")
public class WarehouseReceiptDetail {

    @EmbeddedId
    private WarehouseReceiptDetailId id;

    @Column(name = "so_luong")
    private int quantity;

    @MapsId("receiptId")
    @ManyToOne
    @JoinColumn(name = "ma_phieu_nhap")
    private WarehouseReceipt warehouseReceipt;

    @MapsId("productId")
    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private Product product;
}
