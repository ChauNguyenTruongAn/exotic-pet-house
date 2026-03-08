package com.example.be_shop_pet.configs;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

@Getter
@NoArgsConstructor
@Component
public class VNPayConfig {

    @Value("${vn-pay.temp-code}")
    private String vnp_TmnCode;

    @Value("${vn-pay.hash-secret}")
    private String vnp_HashSecret;

    @Value("${vn-pay.url.pay}")
    private String vnp_PayUrl;

    @Value("${vn-pay.url.return}")
    private String vnp_ReturnUrl;

    @Value("${vn-pay.url.success}")
    private String frontendSuccessUrl;

    @Value("${vn-pay.url.failure}")
    private String frontendFailureUrl;

    @Value("${vn-pay.url.refund}")
    private String vnp_RefundUrl;

   public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    public static String getTimeStamp() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("GMT+7"));
        return formatter.format(new Date());
    }
}