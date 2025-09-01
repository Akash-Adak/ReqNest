package com.akash_adak.backend_engine.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(EmailRequest request) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = multipart (attachments allowed)

        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());

        // ✅ HTML Template for email
        String htmlContent = """
                <html>
                  <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color:#4f46e5;">ReqNest Subscription Invoice</h2>
                    <p>Hi %s,</p>
                    <p>Thank you for upgrading to the <b>%s</b> plan.</p>
                    <table style="border-collapse: collapse; width: 100%%; margin-top: 10px;">
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Plan</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Amount Paid</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">₹%s</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">Valid Until</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                      </tr>
                    </table>
                    <p style="margin-top:20px;">Enjoy all the premium features of ReqNest 🚀</p>
                    <p style="font-size:12px; color:#888;">— Team ReqNest<br>(This is an automated email, please do not reply.)</p>
                  </body>
                </html>
                """.formatted(
                request.getTo(),
                request.getPlan(),
                request.getPlan(),
                request.getAmount(),
                request.getValidUntil()
        );

        helper.setText(htmlContent, true);

        // ✅ Attach Invoice PDF
        byte[] pdfBytes = InvoiceGenerator.generateInvoice(request);
        helper.addAttachment("Invoice-" + request.getPlan() + ".pdf",
                new ByteArrayResource(pdfBytes));

        mailSender.send(message);
    }




    // ✅ Simple Text Email (after login, notifications, etc.)
    @Async
    public void sendSimpleEmail(EmailRequest request) throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getMessage());

        mailSender.send(message);
    }
}
