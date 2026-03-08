package com.example.be_shop_pet.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.requests.OrderPromotionDtoCreate;
import com.example.be_shop_pet.dtos.requests.OrderPromotionDtoUpdate;
import com.example.be_shop_pet.dtos.responses.OrderPromotionDtoResponse;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.OrderPromotion;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.repo.OrderPromotionRepository;
import com.example.be_shop_pet.repo.UserRepository;
import com.example.be_shop_pet.utils.PromotionStatus;
import com.example.be_shop_pet.utils.PromotionType;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderPromotionService {

    private final UserRepository userRepository;
    private final OrderPromotionRepository promotionRepository;
    private final UserPromotionService userPromotionService;
    private final EmailService emailService;

    public List<OrderPromotion> getAllForAdmin() {
        return promotionRepository.findAll();
    }

    public List<OrderPromotionDtoResponse> getAllForUser() {
        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();

        return promotionRepository.findAll()
                .stream()
                .filter(p -> p.getStatus() == PromotionStatus.ACTIVE)
                .filter(p -> p.getStartDate().isBefore(
                        vnInstant) && p.getEndDate().isAfter(
                                vnInstant))
                .map(this::convertToResponse)
                .toList();
    }

    public OrderPromotion getById(Long id) {
        if (id == null)
            throw new InvalidArgument("Không được để trống id");

        return promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khuyến mãi với id: " + id));
    }

    public OrderPromotionDtoResponse getPromotionByCode(String code) {
        OrderPromotion promotion = promotionRepository.findByCode(code).orElseThrow(
                () -> new NotFoundException("Không tìm thấy khuyến mãi phù hợp"));

        ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

        LocalDateTime nowInVietnam = LocalDateTime.now(VN_ZONE);

        LocalDateTime start = LocalDateTime.ofInstant(promotion.getStartDate(), VN_ZONE);

        LocalDateTime end = LocalDateTime.ofInstant(promotion.getEndDate(), VN_ZONE);

        if (promotion.getStatus() != PromotionStatus.ACTIVE) {
            throw new InvalidArgument("Khuyến mãi không hoạt động");
        }

        if (nowInVietnam.isBefore(start)) {
            throw new InvalidArgument("Chương trình khuyến mãi chưa bắt đầu");
        }

        if (nowInVietnam.isAfter(end)) {
            throw new InvalidArgument("Chương trình khuyến mãi đã kết thúc");
        }

        return convertToResponse(promotion);
    }

    @Transactional
    public OrderPromotion create(OrderPromotionDtoCreate dto) {
        validateCreate(dto);

        OrderPromotion promotion = OrderPromotion.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .type(dto.getType())
                .value(dto.getValue())
                .minimumOrder(dto.getMinimumOrder())
                .maxDiscount(dto.getMaxDiscount())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .maxUsage(dto.getMaxUsage())
                .status(dto.getStatus())
                .build();

        return promotionRepository.save(promotion);
    }

    @Transactional
    public OrderPromotion update(Long id, OrderPromotionDtoUpdate dto) {

        if (id == null)
            throw new InvalidArgument("Không được để trống id");

        OrderPromotion promotion = getById(id);

        validateUpdate(dto);
        promotion.setCode(dto.getCode());
        promotion.setName(dto.getName());
        promotion.setType(dto.getType());
        promotion.setValue(dto.getValue());
        promotion.setMinimumOrder(dto.getMinimumOrder());
        promotion.setMaxDiscount(dto.getMaxDiscount());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        promotion.setMaxUsage(dto.getMaxUsage());
        promotion.setStatus(dto.getStatus());

        return promotionRepository.save(promotion);
    }

    @Transactional
    public boolean delete(Long id) {

        if (id == null)
            throw new InvalidArgument("Id không được để trống");
        if (!promotionRepository.existsById(id))
            throw new NotFoundException("Khuyến mãi không tồn tại");

        promotionRepository.deleteById(id);
        return true;
    }

    public BigDecimal applyPromotion(String code, BigDecimal orderTotal) {

        OrderPromotion promotion = promotionRepository.findAll()
                .stream()
                .filter(p -> p.getCode().equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Mã khuyến mãi không tồn tại"));

        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();

        if (promotion.getStatus() != PromotionStatus.ACTIVE
                || promotion.getStartDate().isAfter(
                        vnInstant)
                || promotion.getEndDate().isBefore(vnInstant)) {
            throw new InvalidArgument("Mã khuyến mãi đã hết hạn hoặc không khả dụng");
        }

        if (promotion.getMinimumOrder() != null &&
                orderTotal.compareTo(promotion.getMinimumOrder()) < 0) {
            throw new InvalidArgument("Đơn hàng không đạt mức tối thiểu để áp dụng khuyến mãi");
        }

        BigDecimal discount = BigDecimal.ZERO;

        if (promotion.getType() == PromotionType.PERCENT) {
            discount = orderTotal.multiply(promotion.getValue().divide(BigDecimal.valueOf(100)));

            if (promotion.getMaxDiscount() != null) {
                discount = discount.min(promotion.getMaxDiscount());
            }

        } else if (promotion.getType() == PromotionType.AMOUNT) {
            discount = promotion.getValue();
        }

        return orderTotal.subtract(discount).max(BigDecimal.ZERO);
    }

    public boolean promotionForNewUser(String email) throws MessagingException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        OrderPromotion promotion = promotionRepository.findByCode("MUNGBANMOI")
                .orElseThrow(() -> new NotFoundException("Mã khuyến mãi không tồn tại"));

        boolean hasPromotion = userPromotionService.userHasPromotion(user.getId(), promotion.getId());

        if (hasPromotion)
            return false; // cái này có thì cói như đã dùng ròi

        if (promotion.getStatus() != PromotionStatus.ACTIVE)
            return false;

        emailService.sendPromotionFooter(user.getEmail(), promotion.getCode());
        userPromotionService.addPromotion(user.getId(), promotion.getId());

        return true;
    }

    public boolean promotionForMiniGame() throws MessagingException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        OrderPromotion promotion = promotionRepository.findByCode("MINIGAME")
                .orElseThrow(() -> new NotFoundException("Mã khuyến mãi không tồn tại"));

        boolean hasPromotion = userPromotionService.userHasPromotion(user.getId(), promotion.getId());

        if (hasPromotion)
            return false; // cái này có thì cói như đã dùng ròi

        // if (promotion.getStatus() != PromotionStatus.ACTIVE)
        // return false;

        emailService.sendMinigameRewardEmail(user.getEmail(), user.getFullName(), "Mini game tay nhanh hơn máy",
                promotion.getCode());
        userPromotionService.addPromotion(user.getId(), promotion.getId());

        return true;
    }

    private void validateCreate(OrderPromotionDtoCreate dto) {
        if (dto == null)
            throw new InvalidArgument("Không có dữ liệu tạo mới");
        if (dto.getCode() == null || dto.getCode().isBlank())
            throw new InvalidArgument("Mã khuyến mãi không được bỏ trống");
        if (promotionRepository.findAll().stream().anyMatch(p -> p.getCode().equals(dto.getCode())))
            throw new InvalidArgument("Mã khuyến mãi đã tồn tại");
        if (dto.getValue() == null || dto.getValue().compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidArgument("Giá trị phải lớn hơn 0");
        if (dto.getStartDate().isAfter(dto.getEndDate()))
            throw new InvalidArgument("Ngày bắt đầu phải trước ngày kết thúc");
    }

    private void validateUpdate(OrderPromotionDtoUpdate dto) {
        if (dto == null)
            throw new InvalidArgument("Không có dữ liệu cập nhật");
        if (dto.getValue() == null || dto.getValue().compareTo(BigDecimal.ZERO) <= 0)
            throw new InvalidArgument("Giá trị phải lớn hơn 0");
        if (dto.getStartDate().isAfter(dto.getEndDate()))
            throw new InvalidArgument("Ngày bắt đầu phải trước ngày kết thúc");
    }

    private OrderPromotionDtoResponse convertToResponse(OrderPromotion promotion) {
        return OrderPromotionDtoResponse.builder()
                .id(promotion.getId())
                .code(promotion.getCode())
                .name(promotion.getName())
                .type(promotion.getType())
                .value(promotion.getValue())
                .minimumOrder(promotion.getMinimumOrder())
                .maxDiscount(promotion.getMaxDiscount())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .maxUsage(promotion.getMaxUsage())
                .status(promotion.getStatus())
                .build();
    }
}
