package com.example.be_shop_pet.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.services.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/public/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(categoryService.getCategory(id)));
    }

    @GetMapping
    public ResponseEntity<?> getAllCategory() {
        return ResponseEntity.ok().body(ApiResponse.success(categoryService.getAllCategoriesForUser()));
    }

}
