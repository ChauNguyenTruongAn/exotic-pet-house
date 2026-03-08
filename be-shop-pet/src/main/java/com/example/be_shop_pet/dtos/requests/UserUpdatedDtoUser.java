package com.example.be_shop_pet.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdatedDtoUser {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String email;
}
