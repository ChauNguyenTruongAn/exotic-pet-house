package com.example.be_shop_pet.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.requests.CartDto;
import com.example.be_shop_pet.dtos.responses.CartDtoResponse;
import com.example.be_shop_pet.model.CartDetail;
import com.example.be_shop_pet.services.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart() {
        List<CartDetail> cartDetails = cartService.getCartDetail();

        if (cartDetails.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }

        List<CartDtoResponse> cartDtoResponse = new ArrayList<>();

        for (CartDetail cartDetail : cartDetails) {
            cartDtoResponse.add(CartDtoResponse.builder()
                    .id(cartDetail.getCart().getId())
                    .product(cartDetail.getProduct())
                    .quantity(cartDetail.getQuantity())
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.success(cartDtoResponse));
    }

    @PostMapping
    public ResponseEntity<?> addProductToCart(@RequestBody CartDto request) {
        List<CartDetail> cartDetails = cartService.addProductToCart(request.getProductId(), request.getQuantity());

        List<CartDtoResponse> cartDtoResponse = new ArrayList<>();

        for (CartDetail cartDetail : cartDetails) {
            cartDtoResponse.add(CartDtoResponse.builder()
                    .id(cartDetail.getCart().getId())
                    .product(cartDetail.getProduct())
                    .quantity(cartDetail.getQuantity())
                    .build());
        }

        return ResponseEntity
                .ok(ApiResponse.success(cartDtoResponse));
    }

    @PutMapping
    public ResponseEntity<?> updateProductInCart(@RequestBody CartDto request) {
        List<CartDetail> cartDetails = cartService.updateProductInCart(request.getProductId(),
                request.getQuantity());

        List<CartDtoResponse> cartDtoResponse = new ArrayList<>();

        for (CartDetail cartDetail : cartDetails) {
            cartDtoResponse.add(CartDtoResponse.builder()
                    .id(cartDetail.getCart().getId())
                    .product(cartDetail.getProduct())
                    .quantity(cartDetail.getQuantity())
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.success(cartDtoResponse));

    }

    @PutMapping("/clear")
    public ResponseEntity<?> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(ApiResponse.success(true));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProductInCart(@PathVariable Long productId) {
        cartService.deleteProductInCart(productId);
        return ResponseEntity.ok(ApiResponse.success(true));
    }
}
