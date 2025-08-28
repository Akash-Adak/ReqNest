package com.akash_adak.backend_engine.service;

import com.akash_adak.backend_engine.model.ApiSchema;
import com.akash_adak.backend_engine.repository.ApiSchemaRepository;
import org.bson.types.ObjectId;
import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DynamicService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ApiSchemaRepository schemaRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /** CREATE DOCUMENT **/
    public Map<String, Object> createDocument(String apiName, Map<String, Object> payload, String userId) {
        long start = System.currentTimeMillis();
        ApiSchema schema = validateApi(apiName);

        if (payload.containsKey("password")) {
            payload.put("password", encoder.encode((String) payload.get("password")));
        }

        validateAgainstJsonSchema(schema.getSchemaJson(), payload);

        @SuppressWarnings("unchecked")
        Map<String, Object> saved = mongoTemplate.save(payload, apiName);

        logRequest(userId, apiName, "CREATE", 200, System.currentTimeMillis() - start);
        return normalizeDocument(saved);
    }

    /** READ ALL DOCUMENTS **/
    public List<Map<String, Object>> readAllDocuments(String apiName, String userId) {
        long start = System.currentTimeMillis();
        validateApi(apiName);

        List<Map<String, Object>> docs = mongoTemplate.findAll(Map.class, apiName)
                .stream()
                .map(d -> {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> doc = (Map<String, Object>) d;
                    return normalizeDocument(doc);
                })
                .collect(Collectors.toList());

        logRequest(userId, apiName, "READ_ALL", 200, System.currentTimeMillis() - start);
        return docs;
    }

    /** SEARCH **/
    public List<Map<String, Object>> searchDocuments(String apiName, Map<String, Object> searchFields, String userId) {
        long start = System.currentTimeMillis();
        validateApi(apiName);

        if (searchFields == null || searchFields.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Search criteria cannot be empty");
        }

        Query query = new Query();
        searchFields.forEach((key, value) -> query.addCriteria(Criteria.where(key).is(convertIdIfNeeded(value))));

        List<Map<String, Object>> results = mongoTemplate.find(query, Map.class, apiName)
                .stream()
                .map(d -> {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> doc = (Map<String, Object>) d;
                    return normalizeDocument(doc);
                })
                .collect(Collectors.toList());

        if (results.isEmpty()) {
            logRequest(userId, apiName, "SEARCH", 404, System.currentTimeMillis() - start);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No documents found matching criteria");
        }

        logRequest(userId, apiName, "SEARCH", 200, System.currentTimeMillis() - start);
        return results;
    }

    /** UPDATE **/
    public Map<String, Object> updateDocument(String apiName, Map<String, Object> payload, String userId) {
        long start = System.currentTimeMillis();
        validateApi(apiName);

        if (payload == null || payload.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update payload cannot be empty");
        }

        Query query = new Query();
        if (payload.containsKey("_id")) {
            query.addCriteria(Criteria.where("_id").is(convertIdIfNeeded(payload.get("_id"))));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> existing = mongoTemplate.findOne(query, Map.class, apiName);

        if (existing == null) {
            logRequest(userId, apiName, "UPDATE", 404, System.currentTimeMillis() - start);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No document found with given criteria");
        }

        Object internalId = existing.get("_id");
        existing.putAll(payload);
        existing.put("_id", internalId);

        Map<String, Object> updated = mongoTemplate.save(existing, apiName);
        logRequest(userId, apiName, "UPDATE", 200, System.currentTimeMillis() - start);

        return normalizeDocument(updated);
    }

    /** DELETE **/
    public void deleteDocument(String apiName, Map<String, Object> deleteFields, String userId) {
        long start = System.currentTimeMillis();
        validateApi(apiName);

        if (deleteFields == null || deleteFields.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delete criteria cannot be empty");
        }

        Query query = new Query();
        deleteFields.forEach((key, value) -> query.addCriteria(Criteria.where(key).is(convertIdIfNeeded(value))));

        var result = mongoTemplate.remove(query, Map.class, apiName);
        if (result.getDeletedCount() == 0) {
            logRequest(userId, apiName, "DELETE", 404, System.currentTimeMillis() - start);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No document found for delete");
        }

        logRequest(userId, apiName, "DELETE", 200, System.currentTimeMillis() - start);
    }

    /** HELPERS **/

    private ApiSchema validateApi(String apiName) {
        ApiSchema api = schemaRepo.findByName(apiName);
        if (api == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "API '" + apiName + "' not registered in Platform service");
        return api;
    }

    private void validateAgainstJsonSchema(String schemaJson, Map<String, Object> payload) {
        try {
            JSONObject rawSchema = new JSONObject(schemaJson);
            Schema schema = SchemaLoader.load(rawSchema);
            schema.validate(new JSONObject(payload));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload validation failed: " + e.getMessage());
        }
    }

    private void logRequest(String userId, String apiName, String operation, int status, long responseTime) {
        Map<String, Object> log = new HashMap<>();
        log.put("userId", userId);
        log.put("apiName", apiName);
        log.put("operation", operation);
        log.put("status", status);
        log.put("responseTime", responseTime);
        log.put("timestamp", LocalDateTime.now());
        mongoTemplate.save(log, "logs");
    }

    private Object convertIdIfNeeded(Object id) {
        if (id instanceof String) {
            String idStr = (String) id;
            try {
                if (ObjectId.isValid(idStr)) return new ObjectId(idStr);
                return Integer.parseInt(idStr);
            } catch (NumberFormatException e) {
                return idStr;
            }
        }
        return id;
    }

    private Map<String, Object> normalizeDocument(Map<String, Object> doc) {
        if (doc.containsKey("_id")) {
            Object id = doc.get("_id");
            if (id instanceof ObjectId) doc.put("_id", id.toString());
        }
        return doc;
    }
}
