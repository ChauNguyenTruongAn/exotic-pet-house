package com.example.be_shop_pet.services;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.be_shop_pet.dtos.requests.UserDtoCreate;
import com.example.be_shop_pet.dtos.requests.UserDtoUpdate;
import com.example.be_shop_pet.dtos.requests.UserUpdatedDtoUser;
import com.example.be_shop_pet.dtos.responses.UserDtoResponse;
import com.example.be_shop_pet.exceptions.InvalidArgument;
import com.example.be_shop_pet.exceptions.NotFoundException;
import com.example.be_shop_pet.exceptions.UserException;
import com.example.be_shop_pet.model.User;
import com.example.be_shop_pet.repo.UserRepository;
import com.example.be_shop_pet.utils.GeneratePassword;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public List<UserDtoResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    public UserDtoResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        return convertToDto(user);
    }

    @Transactional
    public UserDtoResponse create(UserDtoCreate dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new InvalidArgument("Email đã tồn tại");
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .address(dto.getAddress())
                .role(dto.getRole())
                .build();

        userRepository.save(user);

        return convertToDto(user);
    }

    @Transactional
    public UserDtoResponse update(Long id, UserDtoUpdate dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole());

        userRepository.save(user);

        return convertToDto(user);
    }

    @Transactional
    public UserDtoResponse updateForUser(UserUpdatedDtoUser dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());

        userRepository.save(user);

        return convertToDto(user);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("Người dùng không tồn tại");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // userRepository.findByEmail(auth.getName())
        // .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        // System.out.println(auth.getName());
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        if (user.getEmail().equals(auth.getName())) {
            throw new UserException("không thể xóa chính bản thân");
        }

        userRepository.deleteById(id);
        return true;
    }

    @Transactional
    public boolean changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new InvalidArgument("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Transactional
    public boolean resetPassword(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        String newPassword = GeneratePassword.generatePassword(12);
        emailService.sendResetpasswordEmail(user.getEmail(), newPassword);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;

    }

    private UserDtoResponse convertToDto(User user) {
        return UserDtoResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }
}
