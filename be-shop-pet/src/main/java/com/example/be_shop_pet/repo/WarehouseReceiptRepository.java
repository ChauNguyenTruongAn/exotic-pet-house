package com.example.be_shop_pet.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.WarehouseReceipt;

public interface WarehouseReceiptRepository extends JpaRepository<WarehouseReceipt, Long> {
    
}
