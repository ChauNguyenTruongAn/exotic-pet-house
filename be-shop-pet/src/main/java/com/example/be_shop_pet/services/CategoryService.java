package com.example.be_shop_pet.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.requests.CategoryDtoUpdate;
import com.example.be_shop_pet.dtos.responses.CategoryDtoResponse;
import com.example.be_shop_pet.exceptions.ChildEntityExists;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.Category;
import com.example.be_shop_pet.repo.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category addCategory(Category category) {
        if (category == null)
            return null;
        Category newCategory = categoryRepository.save(category);
        return newCategory;
    }

    public Category getCategory(Long id) {
        if (id == null) {
            throw new InvalidArgument("Không có id");
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục có id: " + id));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<CategoryDtoResponse> getAllCategoriesForUser() {
        List<CategoryDtoResponse> categoriesForUser = categoryRepository.findAll().stream()
                .map(item -> CategoryDtoResponse.builder().name(item.getName()).id(item.getId()).build()).toList();
        return categoriesForUser;
    }

    public Category updateCategory(Long id, CategoryDtoUpdate newCategory) {
        if (id == null) {
            throw new InvalidArgument("Không có id");
        }
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục " + id));

        category.setName(newCategory.getNewName());

        return categoryRepository.save(category);
    }

    public boolean deleteCategory(Long id) {
        if (id == null) {
            throw new InvalidArgument("Không có id");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục " + id));

        if (!category.getSpecies().isEmpty()) {
            throw new ChildEntityExists("Vẫn còn loài trong danh mục");
        }

        categoryRepository.deleteById(id);

        return true;
    }
}
