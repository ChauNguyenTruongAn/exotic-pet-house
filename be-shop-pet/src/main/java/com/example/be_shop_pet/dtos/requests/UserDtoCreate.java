package com.example.be_shop_pet.dtos.requests;


import com.example.be_shop_pet.utils.Role;

import lombok.Data;

@Data
public class UserDtoCreate {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private String address;
    private Role role;
}
