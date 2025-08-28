package com.akash_adak.backend_engine.service;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CloudApiService {

    private final MongoTemplate mongoTemplate;

    public CloudApiService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }



        // Fetch all APIs for the authenticated user
        public List<Document> getAllApis(String email) {
            Query query = new Query();
            query.addCriteria(Criteria.where("userEmail").is(email)); // ✅ use userEmail
            return mongoTemplate.find(query, Document.class, "apiLogs");
        }

        // Fetch API logs by apiName for the authenticated user
        public List<Document> getByApiName(String apiName, String email) {
            Query query = new Query();
            query.addCriteria(Criteria.where("apiName").is(apiName)
                    .and("userId").is(email)); // ✅ use userEmail
            List<Document> ans= mongoTemplate.find(query, Document.class, "logs");
            System.out.println(ans);
            return ans;
        }

        // Save API log with userEmail
        public Document saveApiLog(Document log, String email) {
            log.put("userEmail", email);  // ✅ consistent field
            log.put("timestamp", Instant.now().toString());
            return mongoTemplate.save(log, "apiLogs");
        }
    }

