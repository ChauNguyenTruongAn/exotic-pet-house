package com.example.be_shop_pet.services;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.requests.OrderCreateRequestDto;
import com.example.be_shop_pet.dtos.requests.OrderDetailDto;
import com.example.be_shop_pet.dtos.requests.OrderUpdateRequestDto;
import com.example.be_shop_pet.dtos.responses.OrderDetailResponseDto;
import com.example.be_shop_pet.dtos.responses.OrderResponseDto;
import com.example.be_shop_pet.dtos.responses.PromotionDto;
import com.example.be_shop_pet.dtos.responses.VNPayRefundResponse;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.InvalidPromotion;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.Order;
import com.example.be_shop_pet.model.OrderDetail;
import com.example.be_shop_pet.model.OrderPromotion;
import com.example.be_shop_pet.model.Product;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.repo.OrderPromotionRepository;
import com.example.be_shop_pet.repo.OrderRepository;
import com.example.be_shop_pet.repo.ProductRepository;
import com.example.be_shop_pet.repo.UserRepository;
import com.example.be_shop_pet.utils.OrderStatus;
import com.example.be_shop_pet.utils.PaymentMethod;
import com.example.be_shop_pet.utils.PaymentStatus;
import com.example.be_shop_pet.utils.PromotionStatus;
import com.example.be_shop_pet.utils.PromotionType;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final OrderPromotionRepository promotionRepo;
    private final VNPayService vnPayService;
    
    private final InventoryService inventoryService;

    @Transactional
    public OrderResponseDto createOrder(OrderCreateRequestDto orderCreateRequestDto) {
        User customer = userRepo.findById(orderCreateRequestDto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        OrderPromotion promotion = null;
        if (orderCreateRequestDto.getPromotionCode() != null && !orderCreateRequestDto.getPromotionCode().isEmpty()) {
            promotion = promotionRepo.findByCode(orderCreateRequestDto.getPromotionCode())
                    .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không hợp lệ"));

            Instant now = Instant.now();
            ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

            Instant vnInstant = now
                    .atZone(ZoneOffset.UTC)
                    .withZoneSameInstant(vnZone)
                    .toInstant();
            if (promotion.getStartDate().isAfter(
                    vnInstant)
                    || promotion.getEndDate().isBefore(
                            vnInstant)
                    || promotion.getStatus() != PromotionStatus.ACTIVE) {
                throw new InvalidPromotion("Khuyến mãi chưa khả dụng");
            }
        }

        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();

        Order order = Order.builder()
                .user(customer)
                .orderDate(
                        vnInstant)
                .note(orderCreateRequestDto.getNote())
                .promotion(promotion)
                // tất cả là pending
                .paymentStatus(PaymentStatus.PENDING)
                .paymentMethod(orderCreateRequestDto.getPaymentMethod())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderDetailDto dto : orderCreateRequestDto.getCart()) {

            Product product = productRepo.findById(dto.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + dto.getId()));

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));
            total = total.add(lineTotal);

            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(dto.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            order.getDetails().add(detail);
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (promotion != null) {
            if (promotion.getType() == PromotionType.PERCENT) {
                if (promotion.getMinimumOrder() != null && total.compareTo(promotion.getMinimumOrder()) < 0) {
                    discountAmount = BigDecimal.ZERO;
                } else {

                    discountAmount = total.multiply(promotion.getValue().divide(BigDecimal.valueOf(100)));
                    if (promotion.getMaxDiscount() != null
                            && discountAmount.compareTo(promotion.getMaxDiscount()) > 0) {
                        discountAmount = promotion.getMaxDiscount();
                    }
                }
            } else if (promotion.getType() == PromotionType.AMOUNT) {
                discountAmount = promotion.getValue();
            }
        }

        BigDecimal deliveryFee = orderCreateRequestDto.getDeliveryFee() != null ? orderCreateRequestDto.getDeliveryFee()
                : BigDecimal.ZERO;

        order.setDiscountAmount(discountAmount);
        order.setTotalPrice(total.subtract(discountAmount).add(deliveryFee));
        order.setStatus(OrderStatus.PENDING);
        orderRepo.save(order);

        String paymentLink = "";
        if (order.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentLink = vnPayService.createPaymentUrl(order.getTotalPrice().longValue(), order.getId());
        }
        return mapToResponse(order, paymentLink);
    }

    // =================== User API ===================
    public List<OrderResponseDto> getOrdersForCurrentUser() {
        User currentUser = getCurrentUser();
        return orderRepo.findByUser(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Order getOrderForCurrentUser(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepo.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return order;
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepo.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidArgument("Không thể hủy đơn đã xử lý");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);
    }

    @Transactional
    public void cancelPayment(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.PENDING);
        orderRepo.save(order);
    }

    @Transactional
    public void changeOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        order.setStatus(status);
        orderRepo.save(order);
    }

    @Transactional
    public void paymentSuccessfully(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepo.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
    }

    @Transactional
    public Order updateOrderDetails(Long id, OrderUpdateRequestDto orderUpdateRequestDto) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Đơn hàng không tồn tại"));

        if (order.getStatus() == OrderStatus.CONFIRMED && order.getPaymentStatus() == PaymentStatus.PAID
                && order.getPaymentMethod() == PaymentMethod.VNPAY
                && orderUpdateRequestDto.getStatus() == OrderStatus.CANCELLED) {
            String orderIdStr = String.valueOf(order.getId());
            long amount = order.getTotalPrice().longValue();

            Instant orderInstant = order.getOrderDate();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String transDateStr = formatter.format(orderInstant.atZone(ZoneId.of("Asia/Ho_Chi_Minh")));

            // call api hoàn tiền
            VNPayRefundResponse result = vnPayService.refund(
                    orderIdStr,
                    amount,
                    transDateStr);
            if (result != null && result.getVnpResponseCode().equals("00")) {
                order.setPaymentStatus(PaymentStatus.REFUND);
                order.setStatus(orderUpdateRequestDto.getStatus());
                
            } else {
                System.out.println("Khong the hoan tien");
            }
        } else {
            order.setStatus(orderUpdateRequestDto.getStatus());

        }

        if(order.getStatus() == OrderStatus.CANCELLED) {
            order.getDetails().forEach(
                i -> inventoryService.updateCancel(i.getProduct().getId(), i.getQuantity())
            );
        }

        orderRepo.save(order);
        return order;
    }

    private String formatOrderDate(Instant instant) {
        if (instant == null)
            return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        return formatter.format(instant);
    }

    @Transactional
    public Order removeOrderDetail(Long orderId, Long productId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        order.getDetails().removeIf(d -> d.getProduct().getId().equals(productId));

        BigDecimal total = order.getDetails().stream()
                .map(d -> d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;
        order.setTotalPrice(total.subtract(discount));

        orderRepo.save(order);
        return order;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }

    private OrderResponseDto mapToResponse(Order order) {
        List<OrderDetailResponseDto> details = order.getDetails().stream().map(d -> OrderDetailResponseDto.builder()
                .productId(d.getProduct().getId())
                .imageUrl(d.getProduct().getImageLink())
                .productName(d.getProduct().getName())
                .unitPrice(d.getUnitPrice())
                .quantity(d.getQuantity())
                .lineTotal(d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                .build()).collect(Collectors.toList());

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .note(order.getNote())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .promotion(order.getPromotion() != null ? mapToResponse(order.getPromotion()) : null)
                .status(order.getStatus())
                .details(details)
                .build();
    }

    private OrderResponseDto mapToResponse(Order order, String paymentLink) {
        List<OrderDetailResponseDto> details = order.getDetails().stream().map(d -> OrderDetailResponseDto.builder()
                .productId(d.getProduct().getId())
                .imageUrl(d.getProduct().getImageLink())
                .productName(d.getProduct().getName())
                .unitPrice(d.getUnitPrice())
                .quantity(d.getQuantity())
                .lineTotal(d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                .build()).collect(Collectors.toList());

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .note(order.getNote())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .promotion(order.getPromotion() != null ? mapToResponse(order.getPromotion()) : null)
                .status(order.getStatus())
                .details(details)
                .paymentLink(paymentLink)
                .build();
    }

    private PromotionDto mapToResponse(OrderPromotion promotion) {
        return PromotionDto.builder()
                .promotionId(promotion.getId())
                .code(promotion.getCode())
                .name(promotion.getName())
                .value(promotion.getValue())
                .minimumOrder(promotion.getMinimumOrder())
                .maxDiscount(promotion.getMaxDiscount())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .build();
    }

}
