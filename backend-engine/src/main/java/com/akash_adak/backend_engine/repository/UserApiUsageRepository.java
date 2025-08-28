package com.akash_adak.backend_engine.repository;


import com.akash_adak.backend_engine.model.UserApiUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserApiUsageRepository extends JpaRepository<UserApiUsage, Long> {
    Optional<UserApiUsage> findByUserIdAndApiName(String userId, String apiName);
}
