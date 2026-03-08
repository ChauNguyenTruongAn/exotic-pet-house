package com.example.be_shop_pet.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.requests.SpeciesDtoUpdate;
import com.example.be_shop_pet.exceptions.ChildEntityExists;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.Category;
import com.example.be_shop_pet.model.Species;
import com.example.be_shop_pet.repo.CategoryRepository;
import com.example.be_shop_pet.repo.SpeciesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpeciesService {
    private final SpeciesRepository speciesRepository;
    private final CategoryRepository categoryRepository;
    // private final ProductRepository productRepository;

    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    public List<Species> getAllSpeciesByCategoryId(Long categoryId) {
        return speciesRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new NotFoundException("Không có loài trong danh mục: " + categoryId));
    }

    public Species getSpeciesById(Long categoryId, Long speciesId) {
        if (categoryId == null)
            throw new InvalidArgument("Id danh mục trống");
        if (speciesId == null)
            throw new InvalidArgument("Id loài trống");

        return speciesRepository.findByCategoryIdAndId(categoryId, speciesId)
                .orElseThrow(() -> new NotFoundException(
                        "Không tìm thấy loài có id: " + speciesId + " trong danh mục " + categoryId));
    }

    public Species addSpecies(Long categoryId, Species newSpecies) {
        if (categoryId == null)
            throw new InvalidArgument("Id trống");

        if (newSpecies == null)
            throw new InvalidArgument("Dữ liệu cập nhật bị trống");

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục"));

        Species species = Species.builder().name(newSpecies.getName()).category(category).build();

        if (species == null) {
            throw new InvalidArgument("Loài bị null");
        }

        return speciesRepository.save(species);
    }

    public Species updateSpecies(Long categoryId, Long speciesId, SpeciesDtoUpdate newSpecies) {
        if (categoryId == null)
            throw new InvalidArgument("Id danh mục trống");

        if (speciesId == null)
            throw new InvalidArgument("Id loài trống");

        if (newSpecies == null)
            throw new InvalidArgument("Dữ liệu cập nhật bị trống");

        Species species = getSpeciesById(categoryId, speciesId);

        species.setName(newSpecies.getName());

        return speciesRepository.save(species);
    }

    public Species updateSpecies(Long speciesId, SpeciesDtoUpdate newSpecies) {

        if (speciesId == null)
            throw new InvalidArgument("Id loài trống");

        if (newSpecies == null)
            throw new InvalidArgument("Dữ liệu cập nhật bị trống");

        Species species = speciesRepository.findById(speciesId)
                .orElseThrow(
                        () -> new NotFoundException("Không tìm thấy danh mục có id: " + newSpecies.getCategoryId()));

        Category category = categoryRepository.findById(newSpecies.getCategoryId())
                .orElseThrow(
                        () -> new NotFoundException("Không tìm thấy danh mục có id: " + newSpecies.getCategoryId()));

        species.setName(newSpecies.getName());
        species.setCategory(category);

        return speciesRepository.save(species);
    }

    public Species changeCategoryForSpecies(Long categoryId, Long speciesId, SpeciesDtoUpdate newSpecies) {
        if (categoryId == null)
            throw new InvalidArgument("Id danh mục trống");

        if (speciesId == null)
            throw new InvalidArgument("Id loài trống");

        if (newSpecies == null)
            throw new InvalidArgument("Dữ liệu cập nhật bị trống");

        Species species = getSpeciesById(categoryId, speciesId);

        species.setName(newSpecies.getName());

        @SuppressWarnings("null")
        Category category = categoryRepository.findById(newSpecies.getCategoryId()).orElseThrow(
                () -> new NotFoundException("Không tìm thấy danh mục cần cập nhật: " + newSpecies.getCategoryId()));

        species.setCategory(category);

        return speciesRepository.save(species);
    }

    @SuppressWarnings("null")
    public boolean deleteSpecies(Long categoryId, Long speciesId) {
        Species species = getSpeciesById(categoryId, speciesId);

        if (!species.getProducts().isEmpty())
            throw new ChildEntityExists("Không thành công, loại nay có sản phẩm");

        speciesRepository.deleteById(species.getId());
        return true;
    }

    public boolean deleteSpecies(Long id) {
        if (id == null)
            throw new InvalidArgument("Id trống");

        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy loài có mã: " + id));

        if (!species.getProducts().isEmpty()) {
            throw new ChildEntityExists("Không thể xóa loài khi còn sản phẩm");
        }

        speciesRepository.deleteById(id);
        return true;
    }
}
