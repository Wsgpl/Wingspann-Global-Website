-- ── Migrate hardcoded news articles into the database ────────────────────────
-- Run this in phpMyAdmin or mysql terminal
-- mysql -u root -p wingspann_db < migrate-news.sql

USE wingspann_db;

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

DROP PROCEDURE IF EXISTS add_news_column_if_missing;

DELIMITER //
CREATE PROCEDURE add_news_column_if_missing(
  IN column_name VARCHAR(64),
  IN alter_statement TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'news'
      AND COLUMN_NAME = column_name
  ) THEN
    SET @sql = alter_statement;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL add_news_column_if_missing('summary', 'ALTER TABLE news ADD COLUMN summary TEXT AFTER title');
CALL add_news_column_if_missing('content', 'ALTER TABLE news ADD COLUMN content TEXT AFTER summary');
CALL add_news_column_if_missing('source', 'ALTER TABLE news ADD COLUMN source VARCHAR(255) AFTER content');
CALL add_news_column_if_missing('source_url', 'ALTER TABLE news ADD COLUMN source_url VARCHAR(1000) AFTER source');
CALL add_news_column_if_missing('image_url', 'ALTER TABLE news ADD COLUMN image_url VARCHAR(1000) AFTER source_url');
CALL add_news_column_if_missing('video_url', 'ALTER TABLE news ADD COLUMN video_url VARCHAR(1000) AFTER image_url');
CALL add_news_column_if_missing('extra_videos', 'ALTER TABLE news ADD COLUMN extra_videos JSON AFTER video_url');
CALL add_news_column_if_missing('published_at', 'ALTER TABLE news ADD COLUMN published_at DATE AFTER extra_videos');
CALL add_news_column_if_missing('is_published', 'ALTER TABLE news ADD COLUMN is_published TINYINT(1) DEFAULT 1 AFTER published_at');
CALL add_news_column_if_missing('created_at', 'ALTER TABLE news ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_published');
CALL add_news_column_if_missing('updated_at', 'ALTER TABLE news ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');

DROP PROCEDURE IF EXISTS add_news_column_if_missing;

INSERT INTO news (title, summary, content, image_url, published_at, is_published)
VALUES (
  'Wingspann Global Concludes Autonomous Test Flights for Aquila UAV',
  'Wingspann Global successfully concludes autonomous test flights for the Aquila UAV at the Aerospace Testing Range.',
  'Wingspann Global has officially concluded the third and final phase of autonomous test flights for the Aquila UAV platform at the designated Aerospace Testing Range. These tests verified the performance parameters of the advanced flight envelope, integrating rigorous EMI/EMC environments, RF wireless telemetry endurance, and thermal operational limits. The Aquila UAV demonstrated unprecedented operational reliability.',
  '/Aquila Alpha.jpeg',
  '2026-03-13',
  1
);

INSERT INTO news (title, summary, content, video_url, extra_videos, published_at, is_published)
VALUES (
  'Flight Test Update: 157 Meters Altitude, 6+ KM Distance',
  'Flight Test Update: During our latest test with full team members, the drone reached 157 meters in altitude and successfully covered 6+ km distance.',
  'Flight Test Update: During our latest test with full team members, the drone reached 157 meters in altitude and successfully covered 6+ km distance, demonstrating stable performance and extended range capability.',
  '/22mar update.mov',
  '["/22mar update.mov", "/News update.mp4"]',
  '2026-03-22',
  1
);

SELECT id, title, published_at, is_published FROM news;
