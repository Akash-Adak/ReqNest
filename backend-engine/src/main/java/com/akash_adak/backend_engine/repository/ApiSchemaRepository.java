package com.akash_adak.backend_engine.repository;


import com.akash_adak.backend_engine.model.ApiSchema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiSchemaRepository extends JpaRepository<ApiSchema, Long> {
    ApiSchema findByName(String name);
    List<ApiSchema> findByCreatedBy(String createdBy);
    ApiSchema findByNameAndCreatedBy(String name, String createdBy);
}
