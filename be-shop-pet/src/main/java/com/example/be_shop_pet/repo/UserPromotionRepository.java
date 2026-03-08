package com.example.be_shop_pet.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.UserPromotion;
import com.example.be_shop_pet.model.EmbeddedId.UserPromotionId;

public interface UserPromotionRepository extends JpaRepository<UserPromotion, UserPromotionId> {
    boolean existsById(UserPromotionId id);
}
