package com.akash_adak.backend_engine.notification;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class EmailRequest {
    private List<String> to;
    private String subject;
    private String body;
    private boolean html;
    private String type; // e.g. "PAYMENT", "WELCOME", "ALERT"
    private List<MultipartFile> attachments;
}
