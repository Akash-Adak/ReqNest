package com.akash_adak.backend_engine.service;

import com.akash_adak.backend_engine.model.UserPlan;
import com.akash_adak.backend_engine.repository.UserPlanRepository;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> userTiers = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> hitCounts = new ConcurrentHashMap<>();
    private final UserPlanRepository userPlanRepository;

    public RateLimiterService(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    public Bucket resolveBucket(String apiKey) {
        // Always fetch latest tier from DB
        String currentTier = userPlanRepository.findById(apiKey)
                .map(UserPlan::getTier)
                .orElse("free");

        String cachedTier = userTiers.get(apiKey);

        // If user upgraded plan → reset bucket
        if (cachedTier == null || !cachedTier.equals(currentTier)) {
            Bucket newBucket = createBucketForTier(currentTier);
            buckets.put(apiKey, newBucket);
            userTiers.put(apiKey, currentTier);
            return newBucket;
        }

        // Otherwise, return cached bucket
        return buckets.get(apiKey);
    }

    private Bucket createBucketForTier(String tier) {
        Bandwidth limit;
        switch (tier) {
            case "premium":
                limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofDays(1)));
                break;
            case "enterprise":
                limit = Bandwidth.classic(1000, Refill.greedy(1000, Duration.ofDays(1)));
                break;
            default: // free tier
                limit = Bandwidth.classic(30, Refill.greedy(30, Duration.ofDays(1)));
        }
        return Bucket.builder().addLimit(limit).build();
    }

    public void incrementHit(String apiKey) {
        hitCounts.put(apiKey, hitCounts.getOrDefault(apiKey, 0L) + 1);
    }

    public long getHitCount(String apiKey) {
        return hitCounts.getOrDefault(apiKey, 0L);
    }
}
