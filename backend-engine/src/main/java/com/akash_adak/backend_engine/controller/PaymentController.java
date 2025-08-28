package com.akash_adak.backend_engine.controller;

import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final UserRepository userRepository;

    public PaymentController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> requestData) {
        try {
            Object amtObj = requestData.get("amount");
            int amount;

            if (amtObj instanceof Integer) {
                amount = (Integer) amtObj;
            } else if (amtObj instanceof String) {
                amount = Integer.parseInt((String) amtObj);
            } else {
                throw new IllegalArgumentException("Invalid amount value");
            }

            String plan = (String) requestData.get("plan"); // Free / Premium / Enterprise

            RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // convert to paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);

            Order order = razorpay.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("key", razorpayKey);
            response.put("plan", plan);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Order creation failed: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {
        try {
            String orderId = body.get("orderId");
            String paymentId = body.get("paymentId");
            String signature = body.get("signature");
            String email = body.get("email");
            String plan = body.get("plan");

            String generatedSignature = generateSignature(orderId + "|" + paymentId, razorpaySecret);

            boolean verified = generatedSignature.equals(signature);

            if (verified) {
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if ("premium".equalsIgnoreCase(plan)) {
                    user.setTier("premium");
                } else if ("enterprise".equalsIgnoreCase(plan)) {
                    user.setTier("enterprise");
                } else {
                    user.setTier("free");
                }

                userRepository.save(user);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("verified", verified);
            response.put("plan", plan);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        }
    }

    private String generateSignature(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(data.getBytes());

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
