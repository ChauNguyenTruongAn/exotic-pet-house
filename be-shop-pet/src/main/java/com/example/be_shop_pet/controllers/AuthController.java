package com.example.be_shop_pet.controllers;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.be_shop_pet.dtos.ApiResponse;
import com.example.be_shop_pet.dtos.LoginRequest;
import com.example.be_shop_pet.dtos.RefreshRequest;
import com.example.be_shop_pet.dtos.RegisterRequest;
import com.example.be_shop_pet.dtos.requests.UserChangePasswordDto;
import com.example.be_shop_pet.dtos.requests.UserUpdatedDtoUser;
import com.example.be_shop_pet.dtos.responses.UserDtoResponse;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.repo.UserRepository;
import com.example.be_shop_pet.services.CartService;
import com.example.be_shop_pet.services.JwtService;
import com.example.be_shop_pet.services.UserService;
import com.example.be_shop_pet.utils.Role;

import jakarta.mail.MessagingException;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final CartService cartService;

    @Data
    @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private boolean status;
    }

    /**
     * API ĐĂNG KÝ
     */
    @SuppressWarnings("null")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        cartService.createCart(user.getId());

        return ResponseEntity.ok(AuthResponse.builder()
                .status(true)
                .build());
    }

    /**
     * API ĐĂNG NHẬP
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        User loginUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        // 3. Tạo token
        var accessToken = jwtService.generateAccessToken(user, loginUser);
        var refreshToken = jwtService.generateRefreshToken(user);

        // 4. Trả về cả 2 token
        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .status(true)
                .build());
    }

    /**
     * API LÀM MỚI TOKEN
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        final String refreshToken = request.getRefreshToken();

        try {
            final String username = jwtService.extractUsername(refreshToken);

            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            User loginUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                var newAccessToken = jwtService.generateAccessToken(userDetails, loginUser);

                return ResponseEntity.ok(AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null);
        }

        return ResponseEntity.status(401).body(null);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng có email sau: " + email));
        UserDtoResponse response = UserDtoResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(@RequestBody UserUpdatedDtoUser dto) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateForUser(dto)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updateMyPassword(@RequestBody UserChangePasswordDto dto) {
        return ResponseEntity.ok(ApiResponse
                .success(userService.changePassword(dto.getEmail(), dto.getOldPassword(), dto.getNewPassword())));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) throws MessagingException {
        return ResponseEntity.ok(ApiResponse.success(userService.resetPassword(request.get("email"))));
    }

}