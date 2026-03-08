package com.example.be_shop_pet.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.be_shop_pet.model.Species;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {
    Optional<List<Species>> findByCategoryId(Long categoryId);

    Optional<Species> findByCategoryIdAndId(Long categoryId, Long speciesId);
}
