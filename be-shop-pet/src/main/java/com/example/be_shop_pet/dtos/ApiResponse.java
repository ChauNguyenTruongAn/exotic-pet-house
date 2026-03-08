package com.example.be_shop_pet.dtos;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private Instant timestamp;

    public static <T> ApiResponse<T> success(T data) {

        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();

        return ApiResponse.<T>builder()
                .status(200)
                .message("Success")
                .data(data)
                .timestamp(
                        vnInstant)
                .build();
    }

    public static <T> ApiResponse<T> error(int status, String message) {
        Instant now = Instant.now();
        ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");

        Instant vnInstant = now
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(vnZone)
                .toInstant();

        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .timestamp(
                        vnInstant)
                .build();
    }
}