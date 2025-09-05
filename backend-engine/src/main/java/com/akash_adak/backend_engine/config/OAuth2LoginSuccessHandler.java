package com.akash_adak.backend_engine.config;

import com.akash_adak.backend_engine.model.User;
import com.akash_adak.backend_engine.repository.UserRepository;
import com.akash_adak.backend_engine.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
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

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");


        Map<String, Object> existingSession = redisService.get("JWT_SESSION:" + email, Map.class);
        if (existingSession != null) {
            String token = (String) existingSession.get("token");

            Cookie cookie = new Cookie("JWT_TOKEN", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            System.out.println("Existing session found in Redis, cookie reissued for: " + email);
            response.sendRedirect("http://localhost:5173");
            return;
        }


        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String login = principal.getAttribute("login");
        String avatarUrl = principal.getAttribute("avatar_url");

        String provider = login != null ? "github" : "google";

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

        // 🔑 Generate new token
        String token = jwtUtil.generateToken(email);

        // 📌 Build session object
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("token", token);
        sessionData.put("email", email);
        sessionData.put("name", user.getName());
        sessionData.put("picture", user.getPicture());
        sessionData.put("provider", user.getProvider());

        // 💾 Save to Redis with TTL (7 days)
        redisService.set("JWT_SESSION:" + email, sessionData, 7 * 24 * 60 * 60);

        // 🍪 Set cookie
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        System.out.println("New session created in Redis for user: " + email);
        response.sendRedirect("http://localhost:5173?login=success&provider=" + provider);

    }

    public  String generateApiKey(String email) {
        try {
            String input = email + System.currentTimeMillis() + getRandomSalt();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error generating API key", e);
        }
    }

    private  String getRandomSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(salt);
    }


}
