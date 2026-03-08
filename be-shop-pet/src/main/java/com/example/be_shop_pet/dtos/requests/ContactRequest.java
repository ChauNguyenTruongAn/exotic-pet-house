package com.example.be_shop_pet.dtos.requests;

import lombok.Data;

@Data
public class ContactRequest {
    private String name;
    private String email;
    private String phone;
    private String message;
}