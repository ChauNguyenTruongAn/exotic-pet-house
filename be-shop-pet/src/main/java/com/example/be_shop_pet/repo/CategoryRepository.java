package com.example.be_shop_pet.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.be_shop_pet.model.Category;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}
