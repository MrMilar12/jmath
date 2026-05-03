-- ============================================================
-- jmath_db – MySQL schema
-- Run this ONCE in phpMyAdmin > SQL tab, or via MySQL CLI:
--   mysql -u root -p < setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS jmath_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jmath_db;

-- Teacher / parent user accounts
CREATE TABLE IF NOT EXISTS users (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Child profiles (one teacher can have many children)
CREATE TABLE IF NOT EXISTS children (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  child_name  VARCHAR(200) NOT NULL,
  grade_level VARCHAR(50),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Latest progress snapshot per child (XP, badges, phase flags, competency scores)
CREATE TABLE IF NOT EXISTS child_progress (
  id            INT      AUTO_INCREMENT PRIMARY KEY,
  child_id      INT      NOT NULL UNIQUE,
  snapshot_json LONGTEXT NOT NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Full history of quiz / assessment results
CREATE TABLE IF NOT EXISTS assessment_results (
  id              INT          AUTO_INCREMENT PRIMARY KEY,
  child_id        INT          NOT NULL,
  topic_id        INT          NOT NULL,
  topic_title     VARCHAR(200) NOT NULL,
  score           INT          NOT NULL,
  total           INT          NOT NULL,
  pct             INT          NOT NULL,
  competency_json TEXT,
  xp              INT,
  level           INT,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id)
);

-- Indexes for faster queries
CREATE INDEX idx_children_user   ON children(user_id);
CREATE INDEX idx_results_child   ON assessment_results(child_id);
CREATE INDEX idx_results_topic   ON assessment_results(topic_id);
