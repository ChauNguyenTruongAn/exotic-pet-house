package com.example.be_shop_pet.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.be_shop_pet.dtos.InventoryDTO;
import com.example.be_shop_pet.dtos.filters.ProductFilterDto;
import com.example.be_shop_pet.dtos.requests.ProductDtoCreate;
import com.example.be_shop_pet.dtos.requests.ProductDtoUpdate;
import com.example.be_shop_pet.dtos.responses.ProductDtoResponseUser;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.Inventory;
import com.example.be_shop_pet.model.Product;
import com.example.be_shop_pet.model.Species;
import com.example.be_shop_pet.repo.InventoryRepository;
import com.example.be_shop_pet.repo.ProductRepository;
import com.example.be_shop_pet.repo.SpeciesRepository;
import com.example.be_shop_pet.specs.ProductSpecs;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServices {
    private final ProductRepository productRepository;
    private final SpeciesRepository speciesRepository;
    private final InventoryRepository inventoryRepository;

    public List<ProductDtoResponseUser> getAllForUser() {
        return productRepository.findAll()
                .stream()
                .map(item -> ProductDtoResponseUser.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .description(item.getDescription())
                        .imageLink(item.getImageLink())
                        .price(item.getPrice()).build())
                .toList();
    }

    public List<Product> getAllForAdmin() {
        return productRepository.findAll();
    }

    public List<InventoryDTO> getAllForAdminInventory() {
        List<Object[]> rows = inventoryRepository.getInventoryWithProduct();
        List<InventoryDTO> dtos = new ArrayList<>();

        for (Object[] row : rows) {
            Long maSanPham = ((Number) row[0]).longValue();
            Integer soLuong = ((Number) row[1]).intValue();
            String tenSanPham = (String) row[2];
            String moTa = (String) row[3];
            String anhMinhHoa = (String) row[4];
            BigDecimal giaBan = (BigDecimal) row[5];
            Long maLoai = ((Number) row[6]).longValue();

            dtos.add(new InventoryDTO(maSanPham, soLuong, tenSanPham, moTa, anhMinhHoa, giaBan, maLoai));
        }

        return dtos;
    }

    public ProductDtoResponseUser getByIdForUser(Long id) {

        if (id == null) {
            throw new InvalidArgument("Không để trống id");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm tưởng ứng với id: " + id));

        return ProductDtoResponseUser.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageLink(product.getImageLink())
                .price(product.getPrice())
                .categoryId(product.getSpecies().getCategory().getId())
                .categoryName(product.getSpecies().getCategory().getName())
                .speciesId(product.getSpecies().getId())
                .speciesName(product.getSpecies().getName())
                .build();
    }

    public Product getByIdForAdmin(Long id) {

        if (id == null) {
            throw new InvalidArgument("Không để trống id");
        }

        return productRepository.findByIdForAdmin(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm tưởng ứng với id: " + id));
    }

    public List<Product> getListSpeciesRelated(Long speciesId) {
        return productRepository.findAll()
                .stream()
                .filter((i) -> (i.getSpecies().getId() == speciesId))
                .toList();

    }

    public List<Product> getListCategoryRelated(Long categoryId) {
        return productRepository.findAll()
                .stream()
                .filter((i) -> (i.getSpecies().getCategory().getId() == categoryId))
                .toList();

    }

    @SuppressWarnings("null")
    public Product addProduct(ProductDtoCreate newProduct) {

        if (newProduct == null) {
            throw new InvalidArgument("Không để trống id");
        }

        Species species = getSpecies(newProduct.getSpeciesId());

        Product product = Product.builder()
                .name(newProduct.getName())
                .description(newProduct.getDescription())
                .imageLink(newProduct.getImageLink())
                .price(newProduct.getPrice())
                .species(species)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductDtoUpdate newProduct) {

        if (id == null) {
            throw new InvalidArgument("Không để trống id");
        }

        if (newProduct == null) {
            throw new InvalidArgument("Không có dữ liệu cập nhật");
        }

        Species species = getSpecies(newProduct.getSpeciesId());

        Product product = getByIdForAdmin(id);

        product.setName(newProduct.getName());
        product.setDescription(newProduct.getDescription());
        product.setImageLink(newProduct.getImageLink());
        product.setPrice(newProduct.getPrice());
        product.setSpecies(species);

        return productRepository.save(product);
    }

    @SuppressWarnings("null")
    @Transactional
    public boolean deleteProduct(Long id) {

        if (id == null) {
            throw new InvalidArgument("Không có id");
        }

        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Product không tồn tại");
        }

        Product product = getByIdForAdmin(id);

        Inventory inventory = inventoryRepository.findById(product.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm trong kho hàng"));

        if (inventory.getQuantity() > 0) {
            throw new InvalidArgument("Không thể xóa sản phẩm còn trong kho");
        }

        inventoryRepository.deleteById(inventory.getId());

        productRepository.delete(product);
        return true;
    }

    private Species getSpecies(Long id) {
        return speciesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy loại với id: " + id));
    }

    public List<Product> get3LatestProduct() {
        return productRepository.find3LatestProduct();
    }

    public Page<Product> filterProducts(ProductFilterDto filter, Pageable pageable) {
        Specification<Product> spec = Specification.allOf();
        if (filter != null) {
            if (StringUtils.hasText(filter.getName())) {
                spec = spec.and(ProductSpecs.hasName(filter.getName()));
            }

            if (filter.getPriceRange() == null || !filter.getPriceRange().isEmpty()) {
                spec = spec.and(ProductSpecs.priceBetween(filter.getPriceRange()));
            }

            if (filter.getSpeciesIds() != null || !filter.getSpeciesIds().isEmpty()) {
                spec = spec.and(ProductSpecs.hasSpeciesId(filter.getSpeciesIds()));
            }
            if (filter.getCategoryId() != null) {
                spec = spec.and(ProductSpecs.hasCategoryId(filter.getCategoryId()));
            }
        }

        if (pageable == null) {
            pageable = PageRequest.of(0, 10);
        }

        return productRepository.findAll(spec, pageable);
    }
}
