package com.example.be_shop_pet.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.be_shop_pet.model.OrderPromotion;

@Repository
public interface OrderPromotionRepository extends JpaRepository<OrderPromotion, Long> {
    Optional<OrderPromotion> findByCode(String code);
}
