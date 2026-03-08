package com.example.be_shop_pet.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.requests.OrderCreateRequestDto;
import com.example.be_shop_pet.dtos.responses.InventoryDtoCheck;
import com.example.be_shop_pet.dtos.responses.OrderResponseDto;
import com.example.be_shop_pet.mapper.OrderMapper;
import com.example.be_shop_pet.model.Order;
import com.example.be_shop_pet.services.InventoryService;
import com.example.be_shop_pet.services.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    public final InventoryService inventoryService;
    private final OrderMapper orderMapper;

    // 1. Đặt hàng
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderCreateRequestDto request) {
        OrderResponseDto order = orderService.createOrder(request);

        if (order == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Đơn hàng không được trống"));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(order));
    }

    // 2. Xem danh sách đơn hàng của user hiện tại
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders() {
        List<OrderResponseDto> orders = orderService.getOrdersForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // 3. Xem chi tiết một đơn hàng
    @GetMapping("/my/{orderId}")
    public ResponseEntity<?> getMyOrder(@PathVariable Long orderId) {
        Order order = orderService.getOrderForCurrentUser(orderId);
        return ResponseEntity.ok(ApiResponse.success(
                orderMapper.toOrderResponseDto(order)));
    }

    // 4. Hủy đơn (nếu chưa xuất kho / chưa giao)
    @PutMapping("/my/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    // Check đơn hàng
    @PostMapping("/check")
    public ResponseEntity<?> getAllOrders(@RequestBody List<Long> productIds) {
        List<InventoryDtoCheck> inventories = inventoryService.getInventoryByProductIds(productIds).stream()
                .map(item -> InventoryDtoCheck.builder()
                        .productId(item.getId())
                        .quantityInventory(item.getQuantity())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success(inventories));
    }
}
