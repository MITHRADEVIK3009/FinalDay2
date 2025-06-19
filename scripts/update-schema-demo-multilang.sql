-- ✅ Update database schema for demo mode and multi-language support

-- Add demo and language fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS demo_role VARCHAR(50);

-- Add demo and language fields to officers table  
ALTER TABLE officers ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
ALTER TABLE officers ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE officers ADD COLUMN IF NOT EXISTS demo_department VARCHAR(100);

-- Add language support to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_demo_application BOOLEAN DEFAULT FALSE;

-- Add language support to notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_language VARCHAR(5) DEFAULT 'en';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS translated_title TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS translated_message TEXT;

-- Add demo mode to schemes
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS is_demo_scheme BOOLEAN DEFAULT FALSE;
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS available_languages TEXT[]; -- Array of language codes

-- Create translation cache table
CREATE TABLE IF NOT EXISTS translation_cache (
  id SERIAL PRIMARY KEY,
  source_text TEXT NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI sessions table for tracking AI interactions
CREATE TABLE IF NOT EXISTS ai_sessions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  officer_id VARCHAR(255),
  session_type VARCHAR(50) DEFAULT 'general',
  model_used VARCHAR(50),
  interaction_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create officer forum posts table
CREATE TABLE IF NOT EXISTS officer_forum_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  priority VARCHAR(10) DEFAULT 'medium',
  tags TEXT[],
  is_official BOOLEAN DEFAULT FALSE,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create certificate templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  template_file_path VARCHAR(255),
  required_fields TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create generated certificates table
CREATE TABLE IF NOT EXISTS generated_certificates (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(255) NOT NULL,
  certificate_type VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  certificate_data JSONB,
  qr_code VARCHAR(255),
  blockchain_hash VARCHAR(255),
  generated_by VARCHAR(255) NOT NULL,
  is_demo_certificate BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_demo ON users(is_demo);
CREATE INDEX IF NOT EXISTS idx_users_language ON users(preferred_language);
CREATE INDEX IF NOT EXISTS idx_officers_demo ON officers(is_demo);
CREATE INDEX IF NOT EXISTS idx_applications_demo ON applications(is_demo_application);
CREATE INDEX IF NOT EXISTS idx_translation_cache_key ON translation_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user ON ai_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON officer_forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_certificates_serial ON generated_certificates(serial_number);

-- Insert demo data for officer forum
INSERT INTO officer_forum_posts (
  title, content, author_id, author_name, department, category, status, priority, tags, is_official
) VALUES 
(
  'New Document Verification Guidelines - June 2024',
  'Updated guidelines for verifying income certificates. Please review the new checklist and AI-assisted verification process.',
  'demo-officer-001',
  'District Collector - Chennai',
  'Revenue Department',
  'Policy Updates',
  'pinned',
  'high',
  ARRAY['Policy', 'Document Verification', 'Guidelines'],
  TRUE
),
(
  'AI Classification Accuracy Issues',
  'Has anyone noticed inconsistencies in AI document classification for caste certificates? Getting 85% accuracy instead of expected 95%.',
  'demo-officer-002',
  'VAO - Anna Nagar',
  'Agriculture Department',
  'Technical Discussion',
  'open',
  'medium',
  ARRAY['AI', 'Document Classification', 'Technical'],
  FALSE
);

-- Insert demo certificate templates
INSERT INTO certificate_templates (
  template_name, template_type, template_file_path, required_fields, created_by
) VALUES 
(
  'Income Certificate',
  'income_cert',
  'templates/income_certificate.pdf',
  ARRAY['applicantName', 'fatherName', 'address', 'income', 'issueDate'],
  'demo-officer-001'
),
(
  'Caste Certificate',
  'caste_cert', 
  'templates/caste_certificate.pdf',
  ARRAY['applicantName', 'fatherName', 'motherName', 'caste', 'address'],
  'demo-officer-001'
),
(
  'Community Certificate',
  'community_cert',
  'templates/community_certificate.pdf', 
  ARRAY['applicantName', 'fatherName', 'community', 'address', 'issueDate'],
  'demo-officer-001'
);
