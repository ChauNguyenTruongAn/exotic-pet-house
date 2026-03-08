package com.example.be_shop_pet.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.be_shop_pet.dtos.ApiResponse;

import jakarta.mail.MessagingException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(InvalidArgument.class)
    public ResponseEntity<?> handleInvalidArgument(InvalidArgument ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(ChildEntityExists.class)
    public ResponseEntity<?> handleChildEntityExists(ChildEntityExists ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(InvalidPromotion.class)
    public ResponseEntity<?> handleInvalidPromotion(InvalidPromotion ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<?> handleUserException(UserException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<?> handleMessagingException(MessagingException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(404, ex.getMessage()));
    }
}
