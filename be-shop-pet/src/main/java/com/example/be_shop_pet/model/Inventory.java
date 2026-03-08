package com.example.be_shop_pet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
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
@Table(name = "ton_kho")
public class Inventory {

    @Id
    @Column(name = "ma_san_pham")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // chính là id sản phẩm

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @Column(name = "so_luong", nullable = false)
    private Integer quantity;
}
