package com.akash_adak.backend_engine.notification;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class EmailRequest {
    private String to;
    private String subject;
    private String body;
    private String message;
    // For invoice
    private String plan;
    private String amount;
    private String validUntil;

    // Getters & Setters
    // ...
}
