package com.example.be_shop_pet.controllers;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.filters.ProductFilterDto;
import com.example.be_shop_pet.services.ProductServices;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductServices productServices;

    @GetMapping
    public ResponseEntity<?> getAllProduct() {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.getAllForUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.getByIdForUser(id)));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getProductByFilter(@ModelAttribute ProductFilterDto filter,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok().body(productServices.filterProducts(filter, pageable));
    }

    @GetMapping("/species/{id}")
    public ResponseEntity<?> getSpeciesRelated(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.getListSpeciesRelated(id)));
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<?> getCategoryRelated(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.getListCategoryRelated(id)));
    }

    @GetMapping("/latest")
    public ResponseEntity<?> get3LatestProduct() {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.get3LatestProduct()));
    }
}
