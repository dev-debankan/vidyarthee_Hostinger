-- Initial Schema for Bidyarthi Free Coaching Centre

-- 1. admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users are viewable by everyone" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Admin users can be created by authenticated users" ON admin_users FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_bn TEXT NOT NULL,
    title_en TEXT,
    body_bn TEXT,
    body_en TEXT,
    file_url TEXT,
    file_type TEXT CHECK (file_type IN ('pdf', 'txt', 'null', NULL)),
    file_size INTEGER CHECK (file_size IS NULL OR file_size <= 5242880),
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX notices_published_at_idx ON notices(published_at DESC);
CREATE INDEX notices_is_pinned_idx ON notices(is_pinned);

-- RLS
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notices are viewable by everyone" ON notices FOR SELECT USING (true);
CREATE POLICY "Admins can insert notices" ON notices FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update notices" ON notices FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete notices" ON notices FOR DELETE USING (public.is_admin());


-- 3. events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_bn TEXT NOT NULL,
    title_en TEXT,
    description_bn TEXT NOT NULL,
    description_en TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX events_date_idx ON events(date DESC);
CREATE INDEX events_is_published_idx ON events(is_published);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events are viewable by everyone" ON events FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete events" ON events FOR DELETE USING (public.is_admin());


-- 4. gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    thumb_url TEXT NOT NULL,
    caption_bn TEXT,
    caption_en TEXT,
    category TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX gallery_items_category_idx ON gallery_items(category);
CREATE INDEX gallery_items_sort_order_idx ON gallery_items(sort_order);

-- RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery items are viewable by everyone" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery items" ON gallery_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update gallery items" ON gallery_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete gallery items" ON gallery_items FOR DELETE USING (public.is_admin());


-- 5. form_links
CREATE TABLE IF NOT EXISTS form_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_bn TEXT NOT NULL,
    title_en TEXT,
    description_bn TEXT,
    description_en TEXT,
    google_form_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX form_links_is_active_idx ON form_links(is_active);

-- RLS
ALTER TABLE form_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active form links viewable by everyone" ON form_links FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert form links" ON form_links FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update form links" ON form_links FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete form links" ON form_links FOR DELETE USING (public.is_admin());


-- 6. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert site settings" ON site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete site settings" ON site_settings FOR DELETE USING (public.is_admin());


-- 7. messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view messages" ON messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Only admins can update messages" ON messages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete messages" ON messages FOR DELETE USING (public.is_admin());


-- 8. highlights
CREATE TABLE IF NOT EXISTS highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_bn TEXT NOT NULL,
    title_en TEXT,
    description_bn TEXT NOT NULL,
    description_en TEXT,
    icon TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX highlights_is_active_idx ON highlights(is_active);
CREATE INDEX highlights_sort_order_idx ON highlights(sort_order);

-- RLS
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active highlights viewable by everyone" ON highlights FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert highlights" ON highlights FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update highlights" ON highlights FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete highlights" ON highlights FOR DELETE USING (public.is_admin());


-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('notice-files', 'notice-files', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-photos', 'site-photos', true) ON CONFLICT DO NOTHING;

-- Storage RLS (Using standard Supabase policies)
CREATE POLICY "Public notice files are viewable by everyone." ON storage.objects FOR SELECT USING ( bucket_id = 'notice-files' );
CREATE POLICY "Admin notice files upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'notice-files' AND public.is_admin() );
CREATE POLICY "Admin notice files update" ON storage.objects FOR UPDATE USING ( bucket_id = 'notice-files' AND public.is_admin() );
CREATE POLICY "Admin notice files delete" ON storage.objects FOR DELETE USING ( bucket_id = 'notice-files' AND public.is_admin() );

CREATE POLICY "Public gallery images are viewable by everyone." ON storage.objects FOR SELECT USING ( bucket_id = 'gallery-images' );
CREATE POLICY "Admin gallery images upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'gallery-images' AND public.is_admin() );
CREATE POLICY "Admin gallery images update" ON storage.objects FOR UPDATE USING ( bucket_id = 'gallery-images' AND public.is_admin() );
CREATE POLICY "Admin gallery images delete" ON storage.objects FOR DELETE USING ( bucket_id = 'gallery-images' AND public.is_admin() );

CREATE POLICY "Public site photos are viewable by everyone." ON storage.objects FOR SELECT USING ( bucket_id = 'site-photos' );
CREATE POLICY "Admin site photos upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'site-photos' AND public.is_admin() );
CREATE POLICY "Admin site photos update" ON storage.objects FOR UPDATE USING ( bucket_id = 'site-photos' AND public.is_admin() );
CREATE POLICY "Admin site photos delete" ON storage.objects FOR DELETE USING ( bucket_id = 'site-photos' AND public.is_admin() );
