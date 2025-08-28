package com.akash_adak.backend_engine.repository;

import com.akash_adak.backend_engine.model.UserPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPlanRepository extends JpaRepository<UserPlan, String> {
}
