USE wingspann_db;

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

INSERT INTO career_positions
  (title, department, description, category, sort_order, is_published, apply_enabled)
SELECT title, department, description, category, sort_order, is_published, apply_enabled
FROM (
  SELECT 'Aerospace Engineer' AS title, 'Engineering' AS department, 'Design and develop next-generation aerospace systems and components.' AS description, 'technical' AS category, 10 AS sort_order, 1 AS is_published, 0 AS apply_enabled
  UNION ALL SELECT 'AIT Engineer', 'Assembly & Integration', 'Manage the assembly, integration, and testing of complex aerospace systems and platforms.', 'technical', 20, 1, 0
  UNION ALL SELECT 'Software Engineer', 'Software Development', 'Build autonomous systems and AI-powered software solutions.', 'technical', 30, 1, 0
  UNION ALL SELECT 'Software Testing Engineer', 'Quality Assurance', 'Ensure the reliability and safety of flight-critical software systems through rigorous testing.', 'technical', 40, 1, 0
  UNION ALL SELECT 'Robotics Specialist', 'Robotics', 'Develop and integrate robotics systems for autonomous platforms.', 'technical', 50, 1, 0
  UNION ALL SELECT 'Systems Architect', 'Systems', 'Design complex systems integrating hardware and software components.', 'technical', 60, 1, 0
  UNION ALL SELECT 'Materials Scientist', 'Research & Development', 'Research and develop advanced materials for aerospace applications.', 'technical', 70, 1, 0
  UNION ALL SELECT 'Supply Chain', 'Operations', 'Optimize global sourcing, procurement, and logistics for advanced manufacturing.', 'business', 10, 1, 0
  UNION ALL SELECT 'Sales & Marketing', 'Business Development', 'Drive product growth and build global partnerships across defense and commercial sectors.', 'business', 20, 1, 0
  UNION ALL SELECT 'Service Engineer & Customer Support', 'Client Services', 'Provide technical support and maintain operational readiness for our enterprise clients.', 'business', 30, 1, 0
  UNION ALL SELECT 'Business Head', 'Executive Leadership', 'Lead strategic initiatives, oversee business operations, and drive corporate growth in aerospace systems.', 'business', 40, 1, 0
) seed_positions
WHERE NOT EXISTS (
  SELECT 1
  FROM career_positions
  WHERE career_positions.title = seed_positions.title
    AND career_positions.category = seed_positions.category
);
