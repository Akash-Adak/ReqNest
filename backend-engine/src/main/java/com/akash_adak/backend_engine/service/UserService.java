package com.akash_adak.backend_engine.service;

import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.model.UserPlan;
import com.akash_adak.backend_engine.repository.UserPlanRepository;
import com.akash_adak.backend_engine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPlanRepository userPlanRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    // Create or update user after OAuth login
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



}
