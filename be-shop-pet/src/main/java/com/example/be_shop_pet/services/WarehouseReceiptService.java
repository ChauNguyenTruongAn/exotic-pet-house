package com.example.be_shop_pet.services;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.interfaces.DetailReceiptDto;
import com.example.be_shop_pet.dtos.requests.WarehouseDetailDtoUpdate;
import com.example.be_shop_pet.dtos.requests.WarehouseReceiptCreateDto;
import com.example.be_shop_pet.dtos.requests.WarehouseReceiptDetailCreateDto;
import com.example.be_shop_pet.exceptions.ChildEntityExists;
import com.example.be_shop_pet.model.Product;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.model.WarehouseReceipt;
import com.example.be_shop_pet.model.WarehouseReceiptDetail;
import com.example.be_shop_pet.model.EmbeddedId.WarehouseReceiptDetailId;
import com.example.be_shop_pet.repo.ProductRepository;
import com.example.be_shop_pet.repo.UserRepository;
import com.example.be_shop_pet.repo.WarehouseReceiptDetailRepository;
import com.example.be_shop_pet.repo.WarehouseReceiptRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarehouseReceiptService {
    private final WarehouseReceiptRepository receiptRepository;
    private final WarehouseReceiptDetailRepository detailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("null")
    @Transactional
    public WarehouseReceipt createReceipt(WarehouseReceiptCreateDto request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();
        if (request.getReceiveTime() != null) {
            vnInstant = request.getReceiveTime();
        }

        WarehouseReceipt receipt = WarehouseReceipt.builder()
                .receiveTime(
                        vnInstant)
                .note(request.getNote())
                .user(user)
                .build();

        receipt = receiptRepository.save(receipt);

        for (WarehouseReceiptDetailCreateDto dto : request.getDetails()) {

            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

            WarehouseReceiptDetail detail = WarehouseReceiptDetail.builder()
                    .id(new WarehouseReceiptDetailId(receipt.getId(), product.getId()))
                    .warehouseReceipt(receipt)
                    .product(product)
                    .quantity(dto.getQuantity())
                    .build();

            detailRepository.save(detail);
        }

        return receipt;
    }

    public WarehouseReceipt getReceiptById(Long id) {
        return receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));
    }

    public List<DetailReceiptDto> getDetailReceiptById(Long id) {
        return detailRepository.findAllProductByReceiptId(id);
    }

    public List<WarehouseReceipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    public boolean updateReceipt(List<WarehouseDetailDtoUpdate> receipt) {

        for (WarehouseDetailDtoUpdate item : receipt) {
            detailRepository.updateDetailReceiptVoid(
                    item.getProductId(),
                    item.getNewpPoductId(),
                    item.getReceiptId(),
                    item.getQuantity());
        }

        return true;
    }

    public boolean updateReceipt(Long id, String note, Instant receiveTime) {

        WarehouseReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        receipt.setNote(note);
        receipt.setReceiveTime(receiveTime);

        receiptRepository.save(receipt);
        return true;
    }

    public int deleteDetailReceipt(Long productId, Long receiptId) {
        return detailRepository.deleteByIdProductIdAndIdReceiptId(productId, receiptId);
    }

    public boolean deleteReceipt(Long id) {
        WarehouseReceipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập"));

        List<WarehouseReceiptDetail> detail = detailRepository.findByIdReceiptId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết phiếu nhập"));
        if (detail.size() > 0) {
            throw new ChildEntityExists("Không thể xóa phiếu nhập khi còn chi tiết");
        }
        receiptRepository.delete(receipt);
        return true;
    }
}
