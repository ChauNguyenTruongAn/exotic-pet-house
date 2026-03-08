package com.example.be_shop_pet.dtos.requests;


import com.example.be_shop_pet.utils.Role;

import lombok.Data;

@Data
public class UserDtoUpdate {
    private String fullName;
    private String phoneNumber;
    private String address;
    private Role role;
}
