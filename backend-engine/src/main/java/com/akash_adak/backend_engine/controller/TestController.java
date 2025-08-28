package com.akash_adak.backend_engine.controller;



import com.akash_adak.backend_engine.config.JwtUtil;
import com.akash_adak.backend_engine.service.ApiUsageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final ApiUsageService usageService;
    @Autowired
    private JwtUtil JwtUtil;

    public TestController(ApiUsageService usageService) {
        this.usageService = usageService;
    }

    @GetMapping("/{apiName}")
    public ResponseEntity<?> callApi(
            @PathVariable String apiName,
            @RequestHeader("Authorization") String authHeader
    ) {
        String userId = JwtUtil.getUserIdFromToken(authHeader); // extract userId from JWT
//
        if (!usageService.allowRequest(userId, apiName)) {
            return ResponseEntity.status(429).body(
                    Map.of("message", "Free API limit exceeded. Please upgrade.")
            );
        }

        int remaining = usageService.remainingHits(userId, apiName);
        Map<String, Object> response = Map.of(
                "message", "API executed successfully",
                "remainingHits", remaining,
                "data", Map.of("example", "API result here")
        );

        return ResponseEntity.ok(response);
    }
}
