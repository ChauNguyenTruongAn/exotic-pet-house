package com.example.be_shop_pet.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.example.be_shop_pet.utils.PromotionStatus;
import com.example.be_shop_pet.utils.PromotionType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.OneToMany;
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
@Table(name = "khuyen_mai_don_hang")
public class OrderPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_khuyen_mai")
    private Long id;

    @Column(name = "ma_code", unique = true)
    private String code;

    @Column(name = "ten_khuyen_mai", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_khuyen_mai", nullable = false)
    private PromotionType type;

    @Column(name = "gia_tri", nullable = false)
    private BigDecimal value;

    @Column(name = "don_toi_thieu")
    private BigDecimal minimumOrder;

    @Column(name = "giam_toi_da")
    private BigDecimal maxDiscount;

    @Column(name = "ngay_bat_dau")
    private Instant startDate;

    @Column(name = "ngay_ket_thuc")
    private Instant endDate;

    @Column(name = "so_lan_su_dung")
    private Integer maxUsage;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private PromotionStatus status;

    @JsonBackReference
    @OneToMany(mappedBy = "promotion")
    @Builder.Default
    private Set<Order> orders = new HashSet<>();
}
