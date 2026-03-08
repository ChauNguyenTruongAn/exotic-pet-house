package com.example.be_shop_pet.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.OrderDetail;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

}
