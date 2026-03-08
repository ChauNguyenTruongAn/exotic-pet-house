package com.example.be_shop_pet.dtos.responses;


import com.example.be_shop_pet.utils.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDtoResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String address;
    private Role role;
}
