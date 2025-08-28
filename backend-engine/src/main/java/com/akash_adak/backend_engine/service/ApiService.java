package com.akash_adak.backend_engine.service;

import com.akash_adak.backend_engine.model.ApiSchema;
import com.akash_adak.backend_engine.repository.ApiSchemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ApiService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ApiSchemaRepository apiSchemaRepository;

    public Object saveRequest(Map<String, Object> payload, String apiName) {
       return mongoTemplate.save(payload,apiName);
    }



}
