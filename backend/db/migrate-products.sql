USE wingspann_db;

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

DROP PROCEDURE IF EXISTS add_products_column_if_missing;

DELIMITER //
CREATE PROCEDURE add_products_column_if_missing(
  IN column_name VARCHAR(64),
  IN alter_statement TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'products'
      AND COLUMN_NAME = column_name
  ) THEN
    SET @sql = alter_statement;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL add_products_column_if_missing('category', 'ALTER TABLE products ADD COLUMN category VARCHAR(50) DEFAULT ''uas'' AFTER slug');
CALL add_products_column_if_missing('tagline', 'ALTER TABLE products ADD COLUMN tagline VARCHAR(500) AFTER category');
CALL add_products_column_if_missing('description', 'ALTER TABLE products ADD COLUMN description TEXT AFTER tagline');
CALL add_products_column_if_missing('specs', 'ALTER TABLE products ADD COLUMN specs JSON AFTER description');
CALL add_products_column_if_missing('features', 'ALTER TABLE products ADD COLUMN features JSON AFTER specs');
CALL add_products_column_if_missing('detail_sections', 'ALTER TABLE products ADD COLUMN detail_sections JSON AFTER features');
CALL add_products_column_if_missing('status', 'ALTER TABLE products ADD COLUMN status ENUM(''active'',''coming_soon'',''retired'') DEFAULT ''active'' AFTER detail_sections');
CALL add_products_column_if_missing('image_url', 'ALTER TABLE products ADD COLUMN image_url VARCHAR(1000) AFTER status');
CALL add_products_column_if_missing('model_url', 'ALTER TABLE products ADD COLUMN model_url VARCHAR(1000) AFTER image_url');
CALL add_products_column_if_missing('sort_order', 'ALTER TABLE products ADD COLUMN sort_order INT DEFAULT 0 AFTER model_url');
CALL add_products_column_if_missing('is_published', 'ALTER TABLE products ADD COLUMN is_published TINYINT(1) DEFAULT 1 AFTER sort_order');
CALL add_products_column_if_missing('created_at', 'ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_published');
CALL add_products_column_if_missing('updated_at', 'ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at');

UPDATE products SET
  category = COALESCE(NULLIF(category, ''), 'uas'),
  status = COALESCE(NULLIF(status, ''), 'active'),
  specs = COALESCE(specs, JSON_ARRAY()),
  features = COALESCE(features, JSON_ARRAY()),
  detail_sections = COALESCE(detail_sections, JSON_OBJECT()),
  sort_order = COALESCE(sort_order, 0),
  is_published = COALESCE(is_published, 1);

DROP PROCEDURE IF EXISTS add_products_column_if_missing;
