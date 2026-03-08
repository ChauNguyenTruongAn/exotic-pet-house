package com.example.be_shop_pet.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.responses.SpeciesDtoResponseForUser;
import com.example.be_shop_pet.dtos.responses.SpeciesDtoResponseUser;
import com.example.be_shop_pet.services.SpeciesService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class SpeciesController {
    private final SpeciesService speciesService;

    @GetMapping("/species")
    public ResponseEntity<?> getAllForUser() {
        return ResponseEntity.ok().body(ApiResponse.success(
                speciesService.getAllSpecies()
                        .stream()
                        .map((i) -> SpeciesDtoResponseForUser
                                .builder()
                                .id(i.getId())
                                .categoryId(i.getCategory().getId())
                                .name(i.getName())
                                .build())));
    }

    @GetMapping("/category/{categoryId}/species")
    public ResponseEntity<?> getAllForUser(@PathVariable Long categoryId) {
        return ResponseEntity.ok().body(ApiResponse.success(speciesService.getAllSpeciesByCategoryId(categoryId)
                .stream().map(
                        (item) -> SpeciesDtoResponseUser.builder().name(item.getName()).build())));
    }

    @GetMapping("/category/{categoryId}/species/{speciesId}")
    public ResponseEntity<?> getSpeciesById(@PathVariable Long categoryId, @PathVariable Long speciesId) {
        return ResponseEntity.ok().body(ApiResponse.success(speciesService.getSpeciesById(categoryId, speciesId)));
    }
}
