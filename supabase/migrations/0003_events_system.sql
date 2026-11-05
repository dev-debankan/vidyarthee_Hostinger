-- Migration 0003: Events System Updates

-- Add category column with default 'Educational'
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Educational' NOT NULL;

-- Category constraint check
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;
ALTER TABLE events ADD CONSTRAINT events_category_check CHECK (
  category IN ('Educational', 'Cultural', 'Social Welfare', 'Book Fair', 'Community', 'Special')
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date DESC);
CREATE INDEX IF NOT EXISTS events_is_published_idx ON events(is_published);
