-- Run this in phpMyAdmin after your existing schema.sql
-- hPanel → Databases → phpMyAdmin → SQL tab

USE wingspann_db;

-- ── News articles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(500) NOT NULL,
  summary      TEXT,
  content      TEXT,
  source       VARCHAR(255),
  source_url   VARCHAR(1000),
  image_url    VARCHAR(1000),
  video_url    VARCHAR(1000),
  extra_videos JSON,
  published_at DATE,
  is_published TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Technology section cards ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS technology_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  category     ENUM('uas','space','aerospace','optical') NOT NULL,
  title        VARCHAR(255) NOT NULL,
  subtitle     VARCHAR(255),
  description  TEXT,
  specs        JSON,
  image_url    VARCHAR(1000),
  sort_order   INT DEFAULT 0,
  is_published TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── UAV products ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  category        VARCHAR(50) DEFAULT 'uas',
  tagline         VARCHAR(500),
  description     TEXT,
  specs           JSON,
  features        JSON,
  detail_sections JSON,
  status          ENUM('active','coming_soon','retired') DEFAULT 'active',
  image_url       VARCHAR(1000),
  model_url       VARCHAR(1000),
  sort_order      INT DEFAULT 0,
  is_published    TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Admin user (single account) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Footer social media buttons ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links_settings (
  id                TINYINT PRIMARY KEY DEFAULT 1,
  instagram_enabled TINYINT(1) DEFAULT 0,
  instagram_url     VARCHAR(1000),
  youtube_enabled   TINYINT(1) DEFAULT 0,
  youtube_url       VARCHAR(1000),
  linkedin_enabled  TINYINT(1) DEFAULT 0,
  linkedin_url      VARCHAR(1000),
  twitter_enabled   TINYINT(1) DEFAULT 0,
  twitter_url       VARCHAR(1000),
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO social_links_settings (id)
VALUES (1)
ON DUPLICATE KEY UPDATE id = id;

-- ── Career page job cards ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_positions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  department    VARCHAR(255),
  description   TEXT,
  category      VARCHAR(50) NOT NULL,
  sort_order    INT DEFAULT 0,
  is_published  TINYINT(1) DEFAULT 1,
  apply_enabled TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert the one admin user
-- Password below is bcrypt hash of "wingspann@admin2024" — CHANGE THIS
-- To generate your own hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('yourpassword',10))"
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$JP/4EGCJ3kBoRw8UGWkPTOu03Xc3vLVWTjUAv0qHbxOzM2paCMz.C')
ON DUPLICATE KEY UPDATE username = username;
