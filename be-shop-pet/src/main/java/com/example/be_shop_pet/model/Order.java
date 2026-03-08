package com.example.be_shop_pet.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.example.be_shop_pet.utils.OrderStatus;
import com.example.be_shop_pet.utils.PaymentMethod;
import com.example.be_shop_pet.utils.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "hoa_don")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hoa_don")
    private Long id;

    @Column(name = "ngay_ban", nullable = false)
    private Instant orderDate;

    @Column(name = "tong_tien")
    private BigDecimal totalPrice;

    @Column(name = "trang_thai", nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "ghi_chu")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khuyen_mai")
    private OrderPromotion promotion;

    @Column(name = "so_tien_giam")
    private BigDecimal discountAmount;

    @Column(name = "trang_thai_thanh_toan")
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "phuong_thuc_thanh_toan")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Builder.Default
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderDetail> details = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "ma_khach_hang")
    private User user;
}
