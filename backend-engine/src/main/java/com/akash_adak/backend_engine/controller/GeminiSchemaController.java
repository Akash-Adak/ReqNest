package com.akash_adak.backend_engine.controller;

import com.akash_adak.backend_engine.service.GeminiSchemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/schema")
public class GeminiSchemaController {

    private final GeminiSchemaService geminiSchemaService;

    @Autowired
    public GeminiSchemaController(GeminiSchemaService geminiSchemaService) {
        this.geminiSchemaService = geminiSchemaService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateSchema(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");

        String generated = geminiSchemaService.generateSchema(prompt);

        // remove ```json ... ```
        String cleaned = generated
                .replaceAll("```json", "")
                .replaceAll("```", "")
                .trim();

        Map<String, Object> response = new HashMap<>();
        response.put("schema", cleaned);
        return ResponseEntity.ok(response);
    }


    public static class SchemaRequest {
        private String prompt;

        public String getPrompt() {
            return prompt;
        }
        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }
    }
}
