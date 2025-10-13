package com.akash_adak.backend_engine.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
@Service
public class GeminiSchemaService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public GeminiSchemaService(@Value("${google.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey)
                .build();
    }

    // 1. Generate JSON Schema
    public String generateSchema(String prompt) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text",
                                "Generate ONLY a JSON Schema for: " + prompt +
                                        ". Return valid JSON only, no explanation, no markdown.")))
                )
        );

        return callGemini(body);
    }

    // 2. Generate Test Data from Schema
    public String generateJson(String prompt) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text",
                                "Generate ONLY a valid JSON object. No explanation, no markdown, no extra text. " + prompt)))
                )
        );

        String responseStr = webClient.post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (responseStr == null) return "{}";

        try {
            JsonNode root = mapper.readTree(responseStr);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText("{}");
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }


    // 🔹 Common call handler
    private String callGemini(Map<String, Object> body) {
        String responseStr = webClient.post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (responseStr == null) return "{}";

        try {
            JsonNode root = mapper.readTree(responseStr);
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText("{}");
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }
}