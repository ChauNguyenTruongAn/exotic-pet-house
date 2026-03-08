package com.example.be_shop_pet.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.requests.ContactRequest;
import com.example.be_shop_pet.services.EmailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/public/mail")
@RequiredArgsConstructor
public class MailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactEmail(@RequestBody ContactRequest request) {
        try {
            emailService.sendContactNotification(request);
            return ResponseEntity.ok("Gửi tin nhắn thành công!");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lỗi gửi mail: " + e.getMessage());
        }
    }
}
