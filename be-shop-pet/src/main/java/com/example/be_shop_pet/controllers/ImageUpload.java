package com.example.be_shop_pet.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.services.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ImageUpload {
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.success(imageUrl));
    }
}
