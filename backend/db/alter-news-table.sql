-- Adds media support columns to the news table.
-- Safe to run multiple times.

USE wingspann_db;

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

CALL add_news_column_if_missing('video_url', 'ALTER TABLE news ADD COLUMN video_url VARCHAR(1000) AFTER image_url');
CALL add_news_column_if_missing('extra_videos', 'ALTER TABLE news ADD COLUMN extra_videos JSON AFTER video_url');

DROP PROCEDURE IF EXISTS add_news_column_if_missing;

DESCRIBE news;
