package com.akash_adak.backend_engine.config;

import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.repository.UserRepository;
import com.akash_adak.backend_engine.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    private RedisService redisService;

    @Value("${app.frontend-url}")
    private String frontendApi;

    @Value("${app.secure-cookie:true}")
    private boolean secureCookie;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();

        // Log all OAuth2 attributes for debugging
        System.out.println("OAuth2 attributes: " + principal.getAttributes());

        String email = principal.getAttribute("email");
        if (email == null) {
            throw new IllegalStateException("OAuth2 provider did not return email");
        }

        // Check existing session in Redis
        try {
            Map<String, Object> existingSession = redisService.get("JWT_SESSION:" + email, Map.class);
            if (existingSession != null) {
                String token = (String) existingSession.get("token");
                addJwtCookie(response, token);
                redirectToFrontend(response, "");
                return;
            }
        } catch (Exception e) {
            System.err.println("Redis session check failed: " + e.getMessage());
        }

        // Extract user info from OAuth2
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String login = principal.getAttribute("login");
        String avatarUrl = principal.getAttribute("avatar_url");

        String provider = login != null ? "github" : "google";

        // Fetch or create user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(provider);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setApikey(generateApiKey(email));
            return newUser;
        });

        user.setName(name != null ? name : login);
        user.setPicture(picture != null ? picture : avatarUrl);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(email);

        // Save session in Redis (optional, non-blocking)
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("token", token);
        sessionData.put("email", email);
        sessionData.put("name", user.getName());
        sessionData.put("picture", user.getPicture());
        sessionData.put("provider", user.getProvider());

        try {
            redisService.set("JWT_SESSION:" + email, sessionData, 7 * 24 * 60 * 60);
        } catch (Exception e) {
            System.err.println("Failed to save session in Redis: " + e.getMessage());
        }

        // Add JWT cookie
        addJwtCookie(response, token);

        // Redirect to frontend
        String queryParams = "?login=success&provider=" + URLEncoder.encode(provider, StandardCharsets.UTF_8);
        redirectToFrontend(response, queryParams);
    }

    private void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // true only if frontend uses HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        // Set domain only for production
        if (!frontendApi.contains("localhost")) {
            cookie.setDomain("reqnest.com");
        }

        response.addCookie(cookie);
    }

    private void redirectToFrontend(HttpServletResponse response, String queryParams) throws IOException {
        String redirectUrl = frontendApi + queryParams;
        response.sendRedirect(redirectUrl);
    }

    private String generateApiKey(String email) {
        try {
            String input = email + System.currentTimeMillis() + getRandomSalt();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error generating API key", e);
        }
    }

    private String getRandomSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(salt);
    }
}
