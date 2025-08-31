package com.akash_adak.backend_engine.notification;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(EmailRequest req) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(req.getTo().toArray(new String[0]));
        helper.setSubject(req.getSubject());
        helper.setText(req.getBody(), req.isHtml());

        // Handle attachments (if uploaded by user)
        if (req.getAttachments() != null) {
            for (MultipartFile file : req.getAttachments()) {
                helper.addAttachment(file.getOriginalFilename(),
                        new ByteArrayResource(file.getBytes()));
            }
        }

        // Handle dynamic cases
        if ("PAYMENT".equalsIgnoreCase(req.getType())) {
            // Generate PDF bill
            ByteArrayOutputStream pdfStream = generatePaymentBill(req);
            helper.addAttachment("invoice.pdf",
                    new ByteArrayResource(pdfStream.toByteArray()));
        } else if ("WELCOME".equalsIgnoreCase(req.getType())) {
            // Example: attach a welcome guide PDF
            ByteArrayOutputStream pdfStream = generateWelcomePdf();
            helper.addAttachment("welcome.pdf",
                    new ByteArrayResource(pdfStream.toByteArray()));
        }

        mailSender.send(message);
    }

    // Generate Payment PDF dynamically
    private ByteArrayOutputStream generatePaymentBill(EmailRequest req) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            document.add(new Paragraph("Payment Invoice", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18)));
            document.add(new Paragraph("==================================="));
            document.add(new Paragraph("Customer: " + String.join(",", req.getTo())));
            document.add(new Paragraph("Subject: " + req.getSubject()));
            document.add(new Paragraph("Message: " + req.getBody()));
            document.add(new Paragraph("Amount: ₹1000")); // You can make this dynamic

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error creating PDF", e);
        }
        return outputStream;
    }

    // Generate Welcome PDF dynamically
    private ByteArrayOutputStream generateWelcomePdf() throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            document.add(new Paragraph("🎉 Welcome to Our Platform! 🎉", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
            document.add(new Paragraph("We’re glad to have you on board. Enjoy using our services."));
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error creating PDF", e);
        }
        return outputStream;
    }
}
