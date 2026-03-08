package com.example.be_shop_pet.exceptions;

public class ChildEntityExists extends RuntimeException {
    public ChildEntityExists(String message) {
        super(message);
    }
}
