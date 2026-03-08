package com.example.be_shop_pet.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.Order;
import com.example.be_shop_pet.model.User;

import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User customer);

    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
