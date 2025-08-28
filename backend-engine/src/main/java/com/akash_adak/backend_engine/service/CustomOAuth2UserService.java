package com.akash_adak.backend_engine.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // If GitHub, fetch emails
        if ("github".equals(userRequest.getClientRegistration().getRegistrationId())) {
            String token = userRequest.getAccessToken().getTokenValue();
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> emails = response.getBody();

            String email = null;
            if (emails != null) {
                email = emails.stream()
                        .filter(e -> Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified")))
                        .map(e -> (String) e.get("email"))
                        .findFirst()
                        .orElse(null);
            }

            // Copy attributes into a mutable map
            Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());

            if (email != null) {
                attributes.put("email", email);
            } else if (attributes.get("login") != null) {
                // fallback if email is private
                attributes.put("email", attributes.get("login") + "@users.noreply.github.com");
            }

            return new DefaultOAuth2User(
                    oauth2User.getAuthorities(),
                    attributes,
                    "id" // or "login" if you prefer
            );
        }

        return oauth2User;
    }
}
