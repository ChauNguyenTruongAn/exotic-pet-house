package com.example.be_shop_pet.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.CartDetail;
import com.example.be_shop_pet.model.EmbeddedId.CartProductId;

public interface CartDetailRepository extends JpaRepository<CartDetail, CartProductId> {
    Optional<CartDetail> findByCartIdAndProductId(Long cartId, Long productId);

    void deleteAllByIdCartId(Long cartId);

    List<CartDetail> findByIdCartId(Long cartId);
}
