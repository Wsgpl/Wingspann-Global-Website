USE wingspann_db;

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
