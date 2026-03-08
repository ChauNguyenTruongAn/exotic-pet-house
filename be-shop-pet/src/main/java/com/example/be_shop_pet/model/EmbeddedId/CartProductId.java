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
public class CartProductId implements Serializable {
    @Column(name = "ma_san_pham")
    private Long productId;
    @Column(name = "ma_gio_hang")
    private Long cartId;
}
