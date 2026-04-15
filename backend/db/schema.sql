-- Run this once on your Hostinger MySQL database
-- hPanel → Databases → phpMyAdmin → SQL tab → paste and run

CREATE DATABASE IF NOT EXISTS wingspann_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE wingspann_db;

-- ── Contact form submissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  org           VARCHAR(255),
  subject       VARCHAR(255),
  inquiry_type  VARCHAR(100),
  message       TEXT NOT NULL,
  routed_to     VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Career applications ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_applications (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(30),
  position         VARCHAR(255) NOT NULL,
  department       VARCHAR(100),
  resume_filename  VARCHAR(255),
  resume_path      VARCHAR(500),
  cover_letter     TEXT,
  status           VARCHAR(50) DEFAULT 'received',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Cookie consents (add later when CookieConsent component is built) ─────────
CREATE TABLE IF NOT EXISTS cookie_consents (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  session_id          VARCHAR(255) NOT NULL,
  analytics_accepted  TINYINT(1) DEFAULT 0,
  marketing_accepted  TINYINT(1) DEFAULT 0,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
