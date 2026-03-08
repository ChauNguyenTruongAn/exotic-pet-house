package com.example.be_shop_pet.controllers;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.services.OrderPromotionService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/promotion")
@RequiredArgsConstructor
public class OrderPromotionController {

    private final OrderPromotionService orderPromotionService;

    @GetMapping
    public ResponseEntity<?> getAllPromotionForUser() {
        return ResponseEntity.ok()
                .body(ApiResponse.success(orderPromotionService.getAllForUser()));
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getPromotionById(@PathVariable String code) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(orderPromotionService.getPromotionByCode(code)));
    }

    @GetMapping("/apply")
    public ResponseEntity<?> applyPromotion(
            @RequestParam String code,
            @RequestParam BigDecimal total) {

        return ResponseEntity.ok()
                .body(ApiResponse.success(orderPromotionService.applyPromotion(code, total)));
    }

    @PostMapping("/footer")
    public ResponseEntity<?> promotionForNewUser(@RequestBody Map<String, String> request) throws MessagingException {
        System.out.println(request.get("email"));
        return ResponseEntity.ok(
                orderPromotionService.promotionForNewUser(request.get("email"))
                        ? ApiResponse.success("Mã khuyến mãi đã được gửi qua mail")
                        : ApiResponse.error(400, "Bạn đã nhận mã khuyến mãi rồi"));
    }

    @PostMapping("/minigame")
    public ResponseEntity<?> promotionForMiniGame() throws MessagingException {

        if (orderPromotionService.promotionForMiniGame()) {
            return ResponseEntity.ok(ApiResponse.success("Mã khuyến mãi đã được gửi qua email"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Bạn đã tham gia sự kiện này rồi"));
        }
    }
}
