package com.akash_adak.backend_engine.controller;

import com.akash_adak.backend_engine.service.CloudApiService;
import org.bson.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/cloud-api")
public class CloudApiController {

    private final CloudApiService cloudApiService;

    public CloudApiController(CloudApiService cloudApiService) {
        this.cloudApiService = cloudApiService;
    }

    @GetMapping("/endpoints")
    public ResponseEntity<List<Document>> getAllApis(OAuth2AuthenticationToken authentication) {
        String email = (String) authentication.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(cloudApiService.getAllApis(email));
    }

    @GetMapping("/endpoints/{apiName}")
    public ResponseEntity<List<Document>> getByApiName(
            @PathVariable String apiName,
            OAuth2AuthenticationToken authentication
    ) {
        String email = (String) authentication.getPrincipal().getAttributes().get("email");
        return ResponseEntity.ok(cloudApiService.getByApiName(apiName, email));
    }

    @PostMapping("/test")
    public ResponseEntity<Document> testApi(
            @RequestBody Document log,
            OAuth2AuthenticationToken authentication
    ) {
        String email = (String) authentication.getPrincipal().getAttributes().get("email");
        Document saved = cloudApiService.saveApiLog(log, email);
        return ResponseEntity.ok(saved);
    }
}
