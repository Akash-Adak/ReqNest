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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public int getHits() {
        return hits;
    }

    public void setHits(int hits) {
        this.hits = hits;
    }

    public Date getLastHit() {
        return lastHit;
    }

    public void setLastHit(Date lastHit) {
        this.lastHit = lastHit;
    }
}
