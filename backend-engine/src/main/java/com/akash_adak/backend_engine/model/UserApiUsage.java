package com.akash_adak.backend_engine.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "user_api_usage", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "apiName"}))
public class UserApiUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String apiName;
    private int hits = 0;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastHit = new Date();

    public UserApiUsage() {}

    public UserApiUsage(String userId, String apiName, int hits) {
        this.userId = userId;
        this.apiName = apiName;
        this.hits = hits;
        this.lastHit = new Date();
    }

}
