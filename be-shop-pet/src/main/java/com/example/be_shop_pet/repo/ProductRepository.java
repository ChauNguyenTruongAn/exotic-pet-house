package com.example.be_shop_pet.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.example.be_shop_pet.model.Product;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query("SELECT p FROM Product p WHERE p.id = ?1")
    Optional<Product> findByIdForAdmin(Long id);

    @Query("SELECT p FROM Product p WHERE p.id = ?1")
    Optional<Product> findByIdForUser(Long id);

    @Query("SELECT p FROM Product p Order By p.id DESC LIMIT 3")
    List<Product> find3LatestProduct();
}
