package com.example.be_shop_pet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class BeShopPetApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeShopPetApplication.class, args);
	}

}
