package com.example.be_shop_pet.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
