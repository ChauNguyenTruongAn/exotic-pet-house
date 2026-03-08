package com.example.be_shop_pet.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "phieu_nhap")
public class WarehouseReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_nhap")
    private Long id;

    @Column(name = "ngay_nhap", nullable = false)
    private Instant receiveTime;

    @Column(name = "ghi_chu")
    private String note;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung")
    @JsonBackReference
    private User user;
}
