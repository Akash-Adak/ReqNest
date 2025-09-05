package com.akash_adak.backend_engine.controller;

import com.akash_adak.backend_engine.config.JwtUtil;
import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.model.UserPlan;
import com.akash_adak.backend_engine.service.RedisService;
import com.akash_adak.backend_engine.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private RedisService redisService;

    @Autowired
    private  JwtUtil jwtUtil;
    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        System.out.println(principal.getAttributes());

        try {
            String email = (String) principal.getAttributes().get("email");

            User user = userService.createOrUpdateUser(principal.getAttributes());

            Map<String, Object> response = Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "picture", user.getPicture(),
                    "provider", user.getProvider(),
                    "createdAt", user.getCreatedAt(),
                    "lastLogin", user.getLastLogin(),
                    "tier", user.getTier(),
                    "apikey",user.getApikey()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user info", "details", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = null;

        // Extract JWT
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // Delete cookie
        Cookie deleteCookie = new Cookie("JWT_TOKEN", null);
        deleteCookie.setPath("/");
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(false); // set true if HTTPS
        deleteCookie.setMaxAge(0);
        response.addCookie(deleteCookie);

        // Redis cleanup
        if (token != null) {
            userService.logoutUser(token);
        }

        // 🔥 Clear Spring Security context
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    @PostMapping("/upgrade")
    public ResponseEntity<?> upgradePlan(@RequestParam String apiKey, @RequestParam String newTier) {
        try {
            User plan = userService.upgradePlan(apiKey, newTier);
            return ResponseEntity.ok(Map.of("message", "Tier updated to " + plan.getTier()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upgrade plan", "details", e.getMessage()));
        }
    }

    @GetMapping("/user/stats")
    public ResponseEntity<?> getUserStats(OAuth2AuthenticationToken authToken) {
        if (authToken == null || authToken.getPrincipal() == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        try {
            String email = (String) authToken.getPrincipal().getAttributes().get("email");
            Map<String, Object> stats = userService.getUserStats(email);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch stats", "details", e.getMessage()));
        }
    }

    @GetMapping("/user/me")
    public ResponseEntity<?> getUser(OAuth2AuthenticationToken authToken) {
        if (authToken == null || authToken.getPrincipal() == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        try {
            String email = (String) authToken.getPrincipal().getAttributes().get("email");
            if (!redisService.exists("JWT_SESSION:" + email)) {
                return ResponseEntity.status(401).body(Map.of("error", "Session expired"));
            }
            Map<String, Object> stats = userService.getUserdetails(email);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch stats", "details", e.getMessage()));
        }
    }


}


