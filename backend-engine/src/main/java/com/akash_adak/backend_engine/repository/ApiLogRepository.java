package com.akash_adak.backend_engine.repository;

import com.akash_adak.backend_engine.model.ApiLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ApiLogRepository extends MongoRepository<ApiLog, String> {
    List<ApiLog> findByApiName(String apiName);

}
