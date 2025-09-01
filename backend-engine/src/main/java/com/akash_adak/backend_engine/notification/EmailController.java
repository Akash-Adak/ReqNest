package com.akash_adak.backend_engine.notification;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<String> sendEmail(@ModelAttribute EmailRequest emailRequest) {
        try {
            emailService.sendEmail(emailRequest);
            return ResponseEntity.ok("✅ Email sent successfully to: " + emailRequest.getTo());
        } catch (MessagingException | IOException e) {
            return ResponseEntity.status(500).body("❌ Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/send-text")
    public ResponseEntity<String> sendSimpleEmail(@RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendSimpleEmail(emailRequest);
            return ResponseEntity.ok("✅ Email sent successfully to: " + emailRequest.getTo());
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("❌ Failed to send email: " + e.getMessage());
        }
    }
}
