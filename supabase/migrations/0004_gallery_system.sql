-- Migration 0004: Gallery System (Photos & Videos)

-- 1. Update gallery_items table constraint if needed
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE NOT NULL;

-- 2. Create gallery_videos table for YouTube links
CREATE TABLE IF NOT EXISTS gallery_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_bn TEXT NOT NULL,
    title_en TEXT,
    youtube_url TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Events', 'Cultural Programmes', 'Activities')),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS gallery_items_category_idx ON gallery_items(category);
CREATE INDEX IF NOT EXISTS gallery_items_sort_order_idx ON gallery_items(sort_order);
CREATE INDEX IF NOT EXISTS gallery_videos_category_idx ON gallery_videos(category);
CREATE INDEX IF NOT EXISTS gallery_videos_sort_order_idx ON gallery_videos(sort_order);

-- Enable RLS on gallery_videos
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery videos are viewable by everyone" ON gallery_videos FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery videos" ON gallery_videos FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update gallery videos" ON gallery_videos FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete gallery videos" ON gallery_videos FOR DELETE USING (public.is_admin());
