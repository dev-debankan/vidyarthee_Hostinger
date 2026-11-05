-- Migration 0002: Notices System Updates

-- Add slug column if it doesn't exist
ALTER TABLE notices ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add category column with default 'Latest'
ALTER TABLE notices ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Latest' NOT NULL;

-- Add is_published column for draft/published status
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE NOT NULL;

-- Add optional expiry_date column
ALTER TABLE notices ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;

-- Drop old file_size constraint and replace with 10MB check limit (10485760 bytes)
ALTER TABLE notices DROP CONSTRAINT IF EXISTS notices_file_size_check;
ALTER TABLE notices ADD CONSTRAINT notices_file_size_check CHECK (file_size IS NULL OR file_size <= 10485760);

-- Category constraint check
ALTER TABLE notices DROP CONSTRAINT IF EXISTS notices_category_check;
ALTER TABLE notices ADD CONSTRAINT notices_category_check CHECK (category IN ('Latest', 'Admission', 'Event', 'Announcement', 'Important Information'));

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS notices_slug_idx ON notices(slug);
CREATE INDEX IF NOT EXISTS notices_category_idx ON notices(category);
CREATE INDEX IF NOT EXISTS notices_is_published_idx ON notices(is_published);
CREATE INDEX IF NOT EXISTS notices_expiry_date_idx ON notices(expiry_date);
