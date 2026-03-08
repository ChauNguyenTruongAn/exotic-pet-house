package com.example.be_shop_pet.utils;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GeneratePassword {
    
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*";

    private static final SecureRandom random = new SecureRandom();

    public static String generatePassword(int length) {
        if (length < 8) {
            throw new IllegalArgumentException("Password phải >= 8 ký tự");
        }

        List<Character> passwordChars = new ArrayList<>();

        passwordChars.add(LOWER.charAt(random.nextInt(LOWER.length())));
        passwordChars.add(UPPER.charAt(random.nextInt(UPPER.length())));
        passwordChars.add(DIGITS.charAt(random.nextInt(DIGITS.length())));
        passwordChars.add(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        String allChars = LOWER + UPPER + DIGITS + SPECIAL;

        // Random các ký tự
        for (int i = passwordChars.size(); i < length; i++) {
            passwordChars.add(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Trộn thứ tự 
        Collections.shuffle(passwordChars, random);

        StringBuilder password = new StringBuilder();
        for (char c : passwordChars) {
            password.append(c);
        }

        return password.toString();
    }

}
