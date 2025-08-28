-- V1__create_endpoints_and_history.sql
CREATE TABLE IF NOT EXISTS endpoints (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  api_name VARCHAR(255),
  label VARCHAR(512),
  method VARCHAR(16),
  path VARCHAR(1024),
  metadata TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  endpoint_id BIGINT,
  user_id BIGINT,
  status INT,
  request_body LONGTEXT,
  response_body LONGTEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_endpoint_user_api ON endpoints(user_id, api_name);
CREATE INDEX idx_history_endpoint_user ON request_history(endpoint_id, user_id);
