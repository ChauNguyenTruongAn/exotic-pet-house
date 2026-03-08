package com.example.be_shop_pet.model;

import com.example.be_shop_pet.model.EmbeddedId.UserPromotionId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "khuyen_mai_nguoi_dung")
public class UserPromotion {
    @EmbeddedId
    private UserPromotionId id;
}
