package com.example.be_shop_pet.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.be_shop_pet.dtos.requests.ContactRequest;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${front-end.url}")
    private String urlFrontEnd;

    @Value("${spring.mail.username}")
    private String adminEmail;

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendResetpasswordEmail(String email, String newPassword) throws MessagingException {
        Context context = new Context();
        context.setVariable("email", email);
        context.setVariable("newPassword", newPassword);
        context.setVariable("linkChangePassword", urlFrontEnd + "/change-password");

        String html = templateEngine.process("email/reset-password", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Đặt lại mật khẩu");
        helper.setText(html, true);

        javaMailSender.send(message);

    }

    @Async
    public void sendPromotionFooter(String to, String promotionCode) throws MessagingException {
        Context context = new Context();
        context.setVariable("promotionCode", promotionCode);

        String html = templateEngine.process("email/promotion-footer", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Khuyến mãi dành cho bạn");
        helper.setText(html, true);

        javaMailSender.send(message);
    }

    @Async
    public void sendMinigameRewardEmail(
            String to,
            String username,
            String rewardName,
            String promotionCode) throws MessagingException {

        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("rewardName", rewardName);
        context.setVariable("promotionCode", promotionCode);
        context.setVariable("urlFrontEnd", urlFrontEnd);

        String html = templateEngine.process("email/minigame-reward", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Chúc mừng! Bạn nhận được mã khuyến mãi từ Minigame");
        helper.setText(html, true);

        javaMailSender.send(message);
    }

    @Async
    public void sendContactNotification(ContactRequest contact) throws MessagingException {
        Context context = new Context();
        context.setVariable("name", contact.getName());
        context.setVariable("email", contact.getEmail());
        context.setVariable("phone", contact.getPhone());
        context.setVariable("message", contact.getMessage());

        String html = templateEngine.process("email/contact-notification", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(adminEmail);

        helper.setReplyTo(contact.getEmail());

        helper.setSubject("Liên hệ mới từ: " + contact.getName());
        helper.setText(html, true);

        javaMailSender.send(message);
    }
}
