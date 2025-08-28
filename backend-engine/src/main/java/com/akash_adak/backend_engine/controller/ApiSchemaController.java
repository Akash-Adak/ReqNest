package com.akash_adak.backend_engine.controller;



import com.akash_adak.backend_engine.model.ApiSchema;
import com.akash_adak.backend_engine.repository.ApiSchemaRepository;

import com.akash_adak.backend_engine.service.ApiService;
import com.akash_adak.backend_engine.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/apis")
public class ApiSchemaController {

    private final ApiSchemaRepository repository;
    @Autowired
    private ApiService apiService;
    @Autowired
    private RedisService redisService;
    public ApiSchemaController(ApiSchemaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<ApiSchema> createSchema(
            @RequestBody ApiSchema schema,
            OAuth2AuthenticationToken authentication
    ) {
        Map<String, Object> userAttributes = authentication.getPrincipal().getAttributes();
        String email = (String) userAttributes.get("email");
//        redisService.set("USERS_API:" + email, schema, 7 * 24 * 60 * 60);
        schema.setCreatedBy(email);
        ApiSchema saved = repository.save(schema);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<ApiSchema>> getAllSchemas(OAuth2AuthenticationToken authentication) {
        Map<String, Object> userAttributes = authentication.getPrincipal().getAttributes();

        String email = (String) userAttributes.get("email");

//        Map<String, Object> existingapis = redisService.get("USERS_API:" + email, Map.class);
//        if(existingapis!=null) {
//            List<ApiSchema> list=new ArrayList<>();
//            for(Map.Entry<String,Object> e: existingapis.entrySet()){
//                list.add((ApiSchema) e.getValue());
//            }
//            return ResponseEntity.ok(list);
//        }
        return ResponseEntity.ok(repository.findByCreatedBy(email));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiSchema> getAllSchemasByName(
            @PathVariable String name,
            OAuth2AuthenticationToken authentication
    ) {
        Map<String, Object> userAttributes = authentication.getPrincipal().getAttributes();

        String email = (String) userAttributes.get("email");

        ApiSchema api = repository.findByNameAndCreatedBy(name, email);
        if (api == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(api);
    }


    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteSchemaByName(
            @PathVariable String name,
            OAuth2AuthenticationToken authentication
    ) {
        Map<String, Object> userAttributes = authentication.getPrincipal().getAttributes();

        String email = (String) userAttributes.get("email");

        ApiSchema api = repository.findByNameAndCreatedBy(name, email);

        if (api == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        repository.delete(api);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{name}")
    public ResponseEntity<ApiSchema> updateSchemaByName(
            @PathVariable String name,      @RequestBody ApiSchema curr,
            OAuth2AuthenticationToken authentication
    ) {
        Map<String, Object> userAttributes = authentication.getPrincipal().getAttributes();

        String email = (String) userAttributes.get("email");

        ApiSchema api = repository.findByNameAndCreatedBy(name, email);
        if (api == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        api.setName(curr.getName());
        api.setSchemaJson(curr.getSchemaJson());
        api.setCreatedBy(email);
        ApiSchema saved = repository.save(api);
        return ResponseEntity.ok(saved);
    }



}
