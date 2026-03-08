package com.example.be_shop_pet.services;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.*;
import com.cloudinary.utils.ObjectUtils;

@Component
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        String cloudinaryUrl = "cloudinary://" + apiKey + ":" + apiSecret + "@" + cloudName;
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class.getSimpleName());

    public String uploadImage(MultipartFile file) {
        Map params1 = ObjectUtils.asMap(
                "tags", Arrays.asList("product", "reptile"),
                "context", ObjectUtils.asMap(
                        "department", "shop",
                        "photographer", "HTShop"),
                "asset_folder", "shop-pet",
                "quality_analysis", true,
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true);

        try {
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), params1);
            log.info("Upload file: " + file + " successfully");
            return result.get("url").toString();

        } catch (IOException e) {
            log.error("Error when upload image", e);
            throw new RuntimeException(e);
        } catch (Exception e) {
            log.error("Error when get detail", e);
            throw new RuntimeException(e);

        }
    }

}
