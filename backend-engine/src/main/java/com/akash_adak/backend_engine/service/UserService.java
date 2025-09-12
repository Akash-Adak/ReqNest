package com.akash_adak.backend_engine.service;

import com.akash_adak.backend_engine.config.JwtUtil;
import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.model.UserPlan;
import com.akash_adak.backend_engine.notification.EmailRequest;
import com.akash_adak.backend_engine.notification.EmailService;
import com.akash_adak.backend_engine.repository.UserPlanRepository;
import com.akash_adak.backend_engine.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPlanRepository userPlanRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisService redisService;

    public User createOrUpdateUser(Map<String, Object> attributes) {
        String email = (String) attributes.get("email");
        if (email == null) throw new IllegalArgumentException("Email not found in OAuth attributes");

        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String login = (String) attributes.get("login");
        String avatarUrl = (String) attributes.get("avatar_url");
        String provider = login != null ? "github" : "google";

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(provider);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setTier("FREE");

            return newUser;
        });

        user.setName(name != null ? name : login);
        user.setPicture(picture != null ? picture : avatarUrl);
        user.setLastLogin(LocalDateTime.now());
        if (user.getTier() == null) user.setTier("FREE");
        EmailRequest emailRequest=new EmailRequest();
        emailRequest.setTo(user.getEmail());
        emailRequest.setSubject("Welcome to ReqNest 🚀");
        emailRequest.setMessage("Hello " + user.getName() + ",\n\n" +

                "A huge welcome to ReqNest! \uD83C\uDF89 We're thrilled to have you join our community of innovators. Your account is now active and ready to go.\n\n" +

                "To get started, here's what you can do:\n" +
                "• **Explore your Dashboard:** Manage your APIs and schemas in one central place.\n" +
                "• **Generate Schemas Faster:** Use our automated tools to accelerate your development.\n" +
                "• **Check out the Docs:** Learn how to get the most out of ReqNest's features.\n\n" +

                "If you have any questions, our support team is happy to assist.\n" +
                "\uD83D\uDC49 Email us at: reqnest@gmail.com\n\n" +

                "Thank you for joining us. We're excited to see what you build!\n\n" +

                "Best regards,\n" +
                "The ReqNest Team ✨\n" +
                "--------------------------------------------------\n" +
                "This is an automated message. Please do not reply directly.");
        try {
            emailService.sendSimpleEmail(emailRequest);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return userRepository.save(user);
    }

    // Create or update plan for user
    public User createOrUpdatePlan(String apiKey, String tier) {
        User plan = userRepository.findByEmail(apiKey).get();
        plan.setTier(tier);
        return userRepository.save(plan);
    }

    // Upgrade user plan
    public User upgradePlan(String apiKey, String newTier) {
        return createOrUpdatePlan(apiKey, newTier);
    }

    // Fetch user stats
    public Map<String, Object> getUserStats(String userId) {
        long callsToday = mongoTemplate.count(
                Query.query(Criteria.where("userId").is(userId)
                        .and("timestamp").gte(LocalDate.now().atStartOfDay())),
                "logs"
        );

        double successRate = calculateSuccessRate(userId);
        double avgResponseTime = calculateAvgResponse(userId);

        List<Map> recentActivity = mongoTemplate.find(
                Query.query(Criteria.where("userId").is(userId))
                        .with(Sort.by(Sort.Direction.DESC, "timestamp"))
                        .limit(5),
                Map.class,
                "logs"
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("callsToday", callsToday);
        stats.put("successRate", successRate);
        stats.put("avgResponseTime", avgResponseTime);
        stats.put("recentActivity", recentActivity);
        return stats;
    }

    // Success rate calculation
    public double calculateSuccessRate(String userId) {
        long total = mongoTemplate.count(Query.query(Criteria.where("userId").is(userId)), "logs");
        if (total == 0) return 0.0;
        long success = mongoTemplate.count(Query.query(Criteria.where("userId").is(userId).and("status").is(200)), "logs");
        return (success * 100.0) / total;
    }

    // Average response time calculation
    public double calculateAvgResponse(String userId) {
        List<Map> logs = mongoTemplate.find(Query.query(Criteria.where("userId").is(userId)), Map.class, "logs");
        if (logs.isEmpty()) return 0.0;
        double sum = 0;
        int count = 0;
        for (Map log : logs) {
            Object rt = log.get("responseTime");
            if (rt instanceof Number) {
                sum += ((Number) rt).doubleValue();
                count++;
            }
        }
        return count == 0 ? 0.0 : sum / count;
    }


    public Map<String, Object> getUserdetails(String email) {
        Map<String, Object> ans=new HashMap<>();

        Optional<User> userde=userRepository.findByEmail(email);
        if(userde.isPresent()){
            User user=userde.get();
            ans.put("email",user.getEmail());
            ans.put("name",user.getName());
            ans.put("createdAt",user.getCreatedAt());
            ans.put("picture",user.getPicture());
            ans.put("apikey",user.getApikey());
            ans.put("tier",user.getTier());
        }

        return ans;
    }

    public void logoutUser(String token) {
        try {
            String email = jwtUtil.extractEmail(token);
            if (email != null) {
                String key = "JWT_SESSION:" + email;
                redisService.delete(key);
                System.out.println("✅ Redis session cleared for: " + email);
            }
        } catch (Exception e) {
            System.out.println("❌ Invalid token during logout: " + e.getMessage());
        }
    }


}
