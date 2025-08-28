package com.akash_adak.backend_engine.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ApiUsageService {

    private final int FREE_LIMIT = 50;

    // userId -> apiName -> hits
    private final Map<String, Map<String, Integer>> usageMap = new HashMap<>();

    public boolean allowRequest(String userId, String apiName) {
        usageMap.putIfAbsent(userId, new HashMap<>());
        Map<String, Integer> userHits = usageMap.get(userId);
        userHits.putIfAbsent(apiName, 0);

        if (userHits.get(apiName) >= FREE_LIMIT) return false;

        userHits.put(apiName, userHits.get(apiName) + 1);
        return true;
    }

    public int remainingHits(String userId, String apiName) {
        usageMap.putIfAbsent(userId, new HashMap<>());
        Map<String, Integer> userHits = usageMap.get(userId);
        int used = userHits.getOrDefault(apiName, 0);
        return Math.max(FREE_LIMIT - used, 0);
    }
}
