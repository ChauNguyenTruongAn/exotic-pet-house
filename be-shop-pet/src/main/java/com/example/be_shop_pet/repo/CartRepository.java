package com.example.be_shop_pet.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
}
