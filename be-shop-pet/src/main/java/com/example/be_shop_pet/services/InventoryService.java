package com.example.be_shop_pet.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.be_shop_pet.model.Inventory;
import com.example.be_shop_pet.repo.InventoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public Inventory getInventoryByProduct(Long productId) {
        return inventoryRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho sản phẩm: " + productId));
    }

    public List<Inventory> getInventoryByProductIds(List<Long> productIds) {
        return inventoryRepository.findByProductIds(productIds);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory updateCancel(Long productId, int quantity) {
        Inventory inventory = getInventoryByProduct(productId);

        inventory.setQuantity(inventory.getQuantity() + quantity);
        return inventoryRepository.save(inventory);
    }
}