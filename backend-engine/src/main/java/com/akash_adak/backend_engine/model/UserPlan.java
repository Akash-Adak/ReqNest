package com.akash_adak.backend_engine.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
public class UserPlan {
    @Id
    private String apiKey; // unique per user

    private String tier;   // free, premium, enterprise
}
