package com.example.be_shop_pet.services;

import com.example.be_shop_pet.configs.VNPayConfig;
import com.example.be_shop_pet.dtos.responses.VNPayRefundResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // --- 1. Method Tạo URL Thanh Toán ---
    public String createPaymentUrl(long amount, Long orderId) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String orderType = "other";
            String vnp_TxnRef = orderId.toString();
            String vnp_IpAddr = getIpAddressFromContext();
            String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String fieldName : fieldNames) {
                String value = vnp_Params.get(fieldName);
                if ((value != null) && (!value.isEmpty())) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    hashData.append('&');

                    query.append(fieldName);
                    query.append('=');
                    query.append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                    query.append('&');
                }
            }

            String queryUrl = query.substring(0, query.length() - 1);
            String hashDataStr = hashData.substring(0, hashData.length() - 1);

            String secureHash = hmacSHA512(vnPayConfig.getVnp_HashSecret(), hashDataStr);

            queryUrl += "&vnp_SecureHash=" + secureHash;
            return vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo URL thanh toán: " + e.getMessage());
        }
    }

    // --- 2. Method Hoàn tiền (SỬA ĐÚNG THỨ TỰ THAM SỐ) ---
    public VNPayRefundResponse refund(String orderId, long amount, String transDate) {

        // 1. Chuẩn bị dữ liệu
        String vnp_RequestId = UUID.randomUUID().toString().replace("-", "");
        String vnp_Version = "2.1.0";
        String vnp_Command = "refund";
        String vnp_TmnCode = vnPayConfig.getVnp_TmnCode();
        String vnp_TransactionType = "02"; // 02: Hoàn toàn phần, 03: Hoàn một phần
        String vnp_TxnRef = orderId;
        long vnp_Amount = amount * 100;
        String vnp_Amount_Str = String.valueOf(vnp_Amount);
        String vnp_OrderInfo = "Hoan tien don hang " + orderId;
        String vnp_TransactionNo = ""; // Để rỗng nếu chưa có
        String vnp_TransactionDate = transDate;
        String vnp_CreateBy = "admin";
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        String vnp_IpAddr = "127.0.0.1";
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                vnp_IpAddr = VNPayConfig.getIpAddress(attributes.getRequest());
            }
        } catch (Exception e) {
            // bỏ qua
        }

        // 2. Tạo Checksum (ĐÚNG THỨ TỰ)
        String hash_Data = String.join("|",
                vnp_RequestId,
                vnp_Version,
                vnp_Command,
                vnp_TmnCode,
                vnp_TransactionType,
                vnp_TxnRef,
                vnp_Amount_Str,
                vnp_TransactionNo,
                vnp_TransactionDate,
                vnp_CreateBy,
                vnp_CreateDate,
                vnp_IpAddr,
                vnp_OrderInfo);

        String vnp_SecureHash = hmacSHA512(vnPayConfig.getVnp_HashSecret(), hash_Data);

        // 3. Tạo JSON Request body (ĐÚNG THỨ TỰ NHU FILE CHẠY ĐƯỢC)
        ObjectNode vnp_Params = objectMapper.createObjectNode();
        vnp_Params.put("vnp_RequestId", vnp_RequestId);
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_TransactionType", vnp_TransactionType);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_TransactionNo", vnp_TransactionNo); // ← ĐẶT TRƯỚC vnp_OrderInfo
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_TransactionDate", vnp_TransactionDate);
        vnp_Params.put("vnp_CreateBy", vnp_CreateBy);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_SecureHash", vnp_SecureHash);

        try {
            // 4. Gửi Request sang VNPay
            String api_Url = vnPayConfig.getVnp_RefundUrl();

            System.out.println("=== REFUND REQUEST ===");
            System.out.println("URL: " + api_Url);
            System.out.println("Hash Data: " + hash_Data);
            System.out.println("SecureHash: " + vnp_SecureHash);
            System.out.println("Request Body: " + vnp_Params.toString());

            String responseStr = sendPostRequest(api_Url, vnp_Params.toString());

            System.out.println("=== REFUND RESPONSE ===");
            System.out.println(responseStr);

            // 5. Parse JSON String trả về thành Object DTO
            return objectMapper.readValue(responseStr, VNPayRefundResponse.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi trong quá trình hoàn tiền: " + e.getMessage());
        }
    }

    // --- Helper Methods ---

    private String getIpAddressFromContext() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                return VNPayConfig.getIpAddress(attributes.getRequest());
            }
        } catch (Exception e) {
            // ignore
        }
        return "127.0.0.1";
    }

    private String sendPostRequest(String targetUrl, String jsonBody) throws IOException {
        URL url = new URL(targetUrl);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(jsonBody);
            wr.flush();
        }

        try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            return response.toString();
        }
    }

    private String hmacSHA512(String key, String data) {
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
            throw new RuntimeException("Lỗi hash HMACSHA512", e);
        }
    }
}