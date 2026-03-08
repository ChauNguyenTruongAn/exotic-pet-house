package com.example.be_shop_pet.model;


import com.example.be_shop_pet.model.EmbeddedId.CartProductId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
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
@Entity(name = "chi_tiet_gio_hang")
public class CartDetail {
    @EmbeddedId
    private CartProductId id;

    @Column(name = "so_luong", nullable = false)
    private int quantity;

    @MapsId("productId")
    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @MapsId("cartId")
    @ManyToOne
    @JoinColumn(name = "ma_gio_hang")
    private Cart cart;
}
