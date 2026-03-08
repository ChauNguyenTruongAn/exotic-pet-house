package com.example.be_shop_pet.controllers;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.CategoryDto;
import com.example.be_shop_pet.dtos.requests.CategoryDtoUpdate;
import com.example.be_shop_pet.dtos.requests.OrderPromotionDtoCreate;
import com.example.be_shop_pet.dtos.requests.OrderPromotionDtoUpdate;
import com.example.be_shop_pet.dtos.requests.OrderUpdateRequestDto;
import com.example.be_shop_pet.dtos.requests.ProductDtoCreate;
import com.example.be_shop_pet.dtos.requests.ProductDtoUpdate;
import com.example.be_shop_pet.dtos.requests.SpeciesDtoCreate;
import com.example.be_shop_pet.dtos.requests.SpeciesDtoUpdate;
import com.example.be_shop_pet.dtos.requests.UserDtoCreate;
import com.example.be_shop_pet.dtos.requests.UserDtoUpdate;
import com.example.be_shop_pet.dtos.requests.WarehouseDetailDtoUpdate;
import com.example.be_shop_pet.dtos.requests.WarehouseReceiptCreateDto;
import com.example.be_shop_pet.dtos.responses.OrderResponseDto;
import com.example.be_shop_pet.dtos.responses.ProductDtoResponseAdmin;
import com.example.be_shop_pet.dtos.responses.SpeciesDtoResponseAdmin;
import com.example.be_shop_pet.mapper.OrderMapper;
import com.example.be_shop_pet.model.Category;
import com.example.be_shop_pet.model.Species;
import com.example.be_shop_pet.model.WarehouseReceipt;
import com.example.be_shop_pet.services.CategoryService;
import com.example.be_shop_pet.services.DashboardService;
import com.example.be_shop_pet.services.InventoryService;
import com.example.be_shop_pet.services.OrderPromotionService;
import com.example.be_shop_pet.services.OrderService;
import com.example.be_shop_pet.services.ProductServices;
import com.example.be_shop_pet.services.SpeciesService;
import com.example.be_shop_pet.services.UserService;
import com.example.be_shop_pet.services.WarehouseReceiptService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    public final CategoryService categoryService;
    public final SpeciesService speciesService;
    private final ProductServices productServices;
    private final OrderPromotionService promotionService;
    private final UserService userService;
    private final WarehouseReceiptService warehouseReceiptService;
    private final InventoryService inventoryService;
    private final OrderService orderService;
    private final OrderMapper orderMapper;
    private final DashboardService dashboardService;

    @PostMapping("/category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addCategory(@RequestBody CategoryDto category) {
        Category newCategory = Category.builder().name(category.getName()).build();
        Category result = categoryService.addCategory(newCategory);
        return ResponseEntity.ok().body(ApiResponse.success(result));
    }

    @GetMapping("/category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllCategoryByAdmin() {
        return ResponseEntity.ok().body(ApiResponse.success(categoryService.getAllCategories()));
    }

    @PutMapping("category/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateCategoryById(@PathVariable Long id, @RequestBody CategoryDtoUpdate request) {
        return ResponseEntity.ok().body(ApiResponse.success(categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("category/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(categoryService.deleteCategory(id)));
    }

    /**
     * 
     * Species
     */

    @GetMapping("/species")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllSpecies() {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.getAllSpecies()
                        .stream()
                        .map(
                                species -> SpeciesDtoResponseAdmin.builder()
                                        .id(species.getId())
                                        .name(species.getName())
                                        .categoryId(species.getCategory().getId())
                                        .build())
                        .toList()));
    }

    @GetMapping("/category/{categoryId}/species")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllSpeciesByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.getAllSpeciesByCategoryId(categoryId)
                        .stream()
                        .map(
                                species -> SpeciesDtoResponseAdmin.builder()
                                        .id(species.getId())
                                        .name(species.getName())
                                        .categoryId(species.getCategory().getId())
                                        .build())
                        .toList()));
    }

    @PostMapping("/category/{id}/species")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addSpeciesIntoCategory(@PathVariable Long id, @RequestBody SpeciesDtoCreate newSpecies) {
        Species species = speciesService.addSpecies(id, Species.builder().name(newSpecies.getName()).build());
        SpeciesDtoResponseAdmin result = SpeciesDtoResponseAdmin.builder()
                .id(species.getId())
                .name(species.getName())
                .categoryId(species.getCategory().getId())
                .build();
        return ResponseEntity.ok().body(ApiResponse
                .success(result));
    }

    @PutMapping("/species/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateSpecies(@PathVariable Long id, @RequestBody SpeciesDtoUpdate newSpecies) {
        return ResponseEntity.ok().body(ApiResponse.success(speciesService.updateSpecies(id, newSpecies)));
    }

    @PutMapping("/category/{categoryId}/species/{speciesId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateSpeciesByCategoryId(@PathVariable Long categoryId, @PathVariable Long speciesId,
            @RequestBody SpeciesDtoUpdate updateSpecies) {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.updateSpecies(categoryId, speciesId, updateSpecies)));
    }

    @PutMapping("/category/{categoryId}/species/{speciesId}/category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> changeCategoryForSpecies(@PathVariable Long categoryId, @PathVariable Long speciesId,
            @RequestBody SpeciesDtoUpdate updateSpecies) {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.changeCategoryForSpecies(categoryId, speciesId, updateSpecies)));
    }

    @DeleteMapping("/category/{categoryId}/species/{speciesId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteSpeciesByCategoryId(@PathVariable Long categoryId, @PathVariable Long speciesId) {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.deleteSpecies(categoryId, speciesId)));
    }

    @DeleteMapping("/species/{speciesId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteSpeciesByCategoryId(@PathVariable(name = "speciesId") Long id) {
        return ResponseEntity.ok().body(
                ApiResponse.success(speciesService.deleteSpecies(id)));
    }

    /**
     * 
     * Product
     */

    @GetMapping("/product")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllProduct() {
        List<ProductDtoResponseAdmin> result = productServices.getAllForAdminInventory().stream().map(
                (item) -> ProductDtoResponseAdmin.builder()
                        .id(item.getMaSanPham())
                        .name(item.getTenSanPham())
                        .description(item.getTenSanPham())
                        .imageLink(item.getAnhMinhHoa())
                        .price(item.getGiaBan())
                        .speciesId(item.getMaLoai())
                        .quantityInventory(item.getSoLuong())
                        .build())
                .toList();

        return ResponseEntity.ok().body(ApiResponse.success(result));
    }

    @GetMapping("/product/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.getByIdForAdmin(id)));
    }

    @PostMapping("/product")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody ProductDtoCreate newProduct) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.addProduct(newProduct)));
    }

    @PutMapping("/product/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProductById(@PathVariable Long id, @RequestBody ProductDtoUpdate request) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.updateProduct(id, request)));
    }

    @DeleteMapping("/product/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProductById(@PathVariable Long id) {
        return ResponseEntity.ok().body(ApiResponse.success(productServices.deleteProduct(id)));
    }

    /**
     * 
     * Promotion
     */

    @GetMapping("/promotion")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllPromotion() {
        return ResponseEntity.ok()
                .body(ApiResponse.success(promotionService.getAllForAdmin()));
    }

    @GetMapping("/promotion/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(promotionService.getById(id)));
    }

    @PostMapping("/promotion")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createPromotion(@RequestBody OrderPromotionDtoCreate dto) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(promotionService.create(dto)));
    }

    @PutMapping("/promotion/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updatePromotion(
            @PathVariable Long id,
            @RequestBody OrderPromotionDtoUpdate dto) {

        return ResponseEntity.ok()
                .body(ApiResponse.success(promotionService.update(id, dto)));
    }

    @DeleteMapping("/promotion/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(promotionService.delete(id)));
    }

    /**
     * User
     */

    @GetMapping("/user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAll()));
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getById(id)));
    }

    @PostMapping("/user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody UserDtoCreate dto) {
        return ResponseEntity.ok(ApiResponse.success(userService.create(dto)));
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDtoUpdate dto) {
        return ResponseEntity.ok(ApiResponse.success(userService.update(id, dto)));
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.delete(id)));
    }

    /**
     * Warehouse
     */

    @PostMapping("/warehouse")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createWarehouseReceipt(@RequestBody WarehouseReceiptCreateDto request) {
        WarehouseReceipt receipt = warehouseReceiptService.createReceipt(request);
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }

    @GetMapping("/warehouse")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllWarehouseReceipt() {
        return ResponseEntity.ok(ApiResponse.success(warehouseReceiptService.getAllReceipts()));
    }

    @GetMapping("/warehouse/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getWarehouseReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(warehouseReceiptService.getDetailReceiptById(id)));
    }

    @DeleteMapping("/warehouse/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteWarehouseReceipt(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(warehouseReceiptService.deleteReceipt(id)));
    }

    @PutMapping("/warehouse/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateWarehouseDetail(@PathVariable Long id,
            @RequestBody List<WarehouseDetailDtoUpdate> entity) {
        return ResponseEntity.ok().body(ApiResponse.success(warehouseReceiptService.updateReceipt(entity)));
    }

    @DeleteMapping("/warehouse/{id}/product/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @PathVariable Long productId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(warehouseReceiptService.deleteDetailReceipt(productId, id)));
    }

    @PutMapping("/warehouse/{id}/total")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateReceipt(@PathVariable Long id, @RequestParam String note,
            @RequestParam Instant receiveTime) {
        return ResponseEntity.ok(ApiResponse.success(warehouseReceiptService.updateReceipt(id, note, receiveTime)));
    }

    /**
     * Inventory
     */

    @GetMapping("/inventory")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllInventory()));
    }

    @GetMapping("/inventory/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getInventoryByProduct(productId)));
    }

    /**
     * Order
     */

    // 5. Xem tất cả đơn hàng
    @GetMapping("/order")
    public ResponseEntity<?> getAllOrders() {

        List<OrderResponseDto> responseDtos = orderService.getAllOrders()
                .stream()
                .map(orderMapper::toOrderResponseDto)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(responseDtos));
    }

    // 6. Xem chi tiết đơn hàng theo id
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        OrderResponseDto order = orderMapper.toOrderResponseDto(orderService.getOrderById(orderId));
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    // 7. Cập nhật trạng thái
    @PutMapping("/order/{orderId}")
    public ResponseEntity<?> updateOrderDetails(
            @PathVariable Long orderId,
            @RequestBody OrderUpdateRequestDto orderUpdateRequestDto) {
        OrderResponseDto order = orderMapper
                .toOrderResponseDto(orderService.updateOrderDetails(orderId, orderUpdateRequestDto));
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    // 1. Lấy KPIs (So sánh doanh thu, đơn hàng, khách hàng mới...)
    // Hàm trong Service: getKpisWithComparison
    @GetMapping("/dashboard/kpis")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getKpis(
            @RequestParam(required = false, defaultValue = "TODAY") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getKpisWithComparison(period, startDate, endDate)));
    }

    // 2. Lấy biểu đồ doanh thu theo thời gian
    // Hàm trong Service: getRevenueByPeriod
    @GetMapping("/dashboard/revenues")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getRevenues(
            @RequestParam(required = false, defaultValue = "WEEK") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getRevenueByPeriod(period, startDate, endDate)));
    }

    // 3. Thống kê trạng thái đơn hàng (Pie chart)
    // Hàm trong Service: getOrderStatusCount
    @GetMapping("/dashboard/order-status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getOrderStatus(
            @RequestParam(required = false, defaultValue = "ALL") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getOrderStatusCount(period, startDate, endDate)));
    }

    // 4. Sản phẩm sắp hết hàng
    // Hàm trong Service: getLowStockProducts
    @GetMapping("/dashboard/low-stock")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getLowStock(
            @RequestParam(required = false, defaultValue = "10") Integer minStock) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getLowStockProducts(minStock)));
    }

    // 5. Đơn hàng gần đây
    // Hàm trong Service: getRecentOrders
    @GetMapping("/dashboard/recent-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getRecentOrders(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getRecentOrders(limit)));
    }

    // 6. Top sản phẩm bán chạy
    // Hàm trong Service: getTopProducts
    @GetMapping("/dashboard/top-products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getTopProducts(
            @RequestParam(required = false, defaultValue = "WEEK") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "5") Integer limit) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getTopProducts(period, startDate, endDate, limit)));
    }

    // 7. Doanh thu theo danh mục sản phẩm
    // Hàm trong Service: getRevenueByCategory
    @GetMapping("/dashboard/revenue-by-category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getRevenueByCategory(
            @RequestParam(required = false, defaultValue = "MONTH") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getRevenueByCategory(period, startDate, endDate)));
    }
}
