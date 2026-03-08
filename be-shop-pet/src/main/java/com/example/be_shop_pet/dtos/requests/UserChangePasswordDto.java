package com.example.be_shop_pet.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserChangePasswordDto {
    private String email;
    private String oldPassword;
    private String newPassword;
}
