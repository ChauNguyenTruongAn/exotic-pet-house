package com.example.be_shop_pet.controllers;

import com.example.be_shop_pet.configs.VNPayConfig;
import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.responses.VNPayRefundResponse;
import com.example.be_shop_pet.services.OrderService;
import com.example.be_shop_pet.services.VNPayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@RestController
@Tag(name = "VNPay Controller")
@RequiredArgsConstructor
@RequestMapping("/api/vnpay")
public class VNPayController {

    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;
    private final VNPayService vnPayService;

    @Operation(method = "GET", summary = "Payment Callback", description = "Xử lý callback của VNPay và chuyển hướng về trang frontend tương ứng với kết quả thanh toán")
    @GetMapping("/payment-callback")
    public void paymentCallback(@RequestParam Map<String, String> params, HttpServletResponse response)
            throws IOException {
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_SecureHash = params.get("vnp_SecureHash");

        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String fieldName = URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII);
            String fieldValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }

        String signValue = hashAllFields(fields, vnPayConfig.getVnp_HashSecret());

        try {
            if (signValue.equals(vnp_SecureHash)) {

                if ("00".equals(vnp_ResponseCode)) {
                    orderService.paymentSuccessfully(Long.parseLong(vnp_TxnRef));

                    response.sendRedirect(vnPayConfig.getFrontendSuccessUrl() + "?txnRef=" + vnp_TxnRef);
                } else {
                    // hủy đơn hàng khi hủy thanh toán
                    orderService.cancelPayment(Long.parseLong(vnp_TxnRef));
                    response.sendRedirect(vnPayConfig.getFrontendFailureUrl() + "?txnRef=" + vnp_TxnRef + "&code="
                            + vnp_ResponseCode);

                }
            } else {
                System.out.println("Invalid Checksum!");
                response.sendRedirect(vnPayConfig.getFrontendFailureUrl() + "?error=invalid_signature");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(vnPayConfig.getFrontendFailureUrl() + "?error=exception");
        }
    }

    private String hashAllFields(Map<String, String> fields, String secretKey) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(secretKey, sb.toString());
    }

    public String hmacSHA512(String key, String data) {
        try {
            Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKey);
            byte[] hash = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo chữ ký HMAC-SHA512", e);
        }
    }

    // @Operation(method = "POST", summary = "Hoàn tiền giao dịch", description = "Gửi yêu cầu hoàn tiền sang VNPay")
    // @PostMapping("/refund-payment")
    // public ResponseEntity<?> refundPayment(HttpServletRequest request,
    //         @RequestParam("orderId") String orderId,
    //         @RequestParam("amount") long amount,
    //         @RequestParam("transDate") String transDate,
    //         @RequestParam("user") String user) {

    //     VNPayRefundResponse response = vnPayService.refund(orderId, amount, transDate);

    //     if ("00".equals(response.getVnpResponseCode())) {
    //         return ResponseEntity.ok(ApiResponse.success(response));
    //     } else {
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //     }
    // }

}