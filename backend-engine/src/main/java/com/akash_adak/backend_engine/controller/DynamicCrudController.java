package com.akash_adak.backend_engine.controller;

import com.akash_adak.backend_engine.service.DynamicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/data/{apiName}")
public class DynamicCrudController {

    @Autowired
    private DynamicService dynamicService;

    /** CREATE **/
    @PostMapping
    public ResponseEntity<?> create(@PathVariable String apiName,
                                    @RequestBody Map<String, Object> payload,
                                    OAuth2AuthenticationToken request) {
        String userId = (String) request.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(dynamicService.createDocument(apiName, payload, userId));
    }

    /** READ ALL **/
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> readAll(@PathVariable String apiName,
                                                             OAuth2AuthenticationToken request) {
        String userId = (String) request.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(dynamicService.readAllDocuments(apiName, userId));
    }

    /** SEARCH **/
    @PostMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@PathVariable String apiName,
                                                            @RequestBody Map<String, Object> searchFields,
                                                            OAuth2AuthenticationToken request) {
        String userId = (String) request.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(dynamicService.searchDocuments(apiName, searchFields, userId));
    }

    /** UPDATE **/
    @PutMapping
    public ResponseEntity<?> update(@PathVariable String apiName,
                                    @RequestBody Map<String, Object> payload,
                                    OAuth2AuthenticationToken request) {
        String userId = (String) request.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(dynamicService.updateDocument(apiName, payload, userId));
    }

    /** DELETE **/
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@PathVariable String apiName,
                                    @RequestBody Map<String, Object> deleteFields,
                                    OAuth2AuthenticationToken request) {
        String userId = (String) request.getPrincipal().getAttributes().get("email");
        dynamicService.deleteDocument(apiName, deleteFields, userId);
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
    }
}
