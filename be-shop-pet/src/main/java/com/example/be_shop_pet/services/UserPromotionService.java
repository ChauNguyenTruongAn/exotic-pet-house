package com.example.be_shop_pet.services;

import org.springframework.stereotype.Service;

import com.example.be_shop_pet.model.UserPromotion;
import com.example.be_shop_pet.model.EmbeddedId.UserPromotionId;
import com.example.be_shop_pet.repo.UserPromotionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserPromotionService {
    private final UserPromotionRepository userPromotionRepository;

    public boolean userHasPromotion(Long userId, Long promotionId) {
        UserPromotionId id = new UserPromotionId(promotionId, userId);
        return userPromotionRepository.existsById(id);
    }

    public void addPromotion(Long userId, Long promotionId) {
        UserPromotionId id = new UserPromotionId(promotionId, userId);
        userPromotionRepository.save(new UserPromotion(id));
    }
}
