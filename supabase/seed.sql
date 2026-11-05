-- Seed Data for Bidyarthi Free Coaching Centre

-- Highlights
INSERT INTO highlights (title_bn, title_en, description_bn, description_en, icon, link, sort_order)
VALUES
('বিনামূল্যে কোচিং', 'Free Coaching', '৫ম থেকে ১০ম শ্রেণীর ছাত্র-ছাত্রীদের জন্য বিনামূল্যে পঠনপাঠনের সুবিধা।', 'Free classes for students from Class V to X.', 'BookOpen', '/coaching', 1),
('ছাত্র পাঠাগার', 'Students Library', '৫,০০০ এর বেশি বই সমৃদ্ধ একটি পাঠাগার।', 'A library enriched with over 5,000 books.', 'Library', '/library', 2),
('সাংস্কৃতিক অনুষ্ঠান', 'Cultural Events', 'ছাত্র-ছাত্রীদের মানসিক বিকাশের জন্য বিভিন্ন অনুষ্ঠান।', 'Various cultural events for the mental development of students.', 'Calendar', '/events', 3);

-- Site Settings
INSERT INTO site_settings (key, value)
VALUES
('phone', '+91 98765 43210'),
('email', 'info@bidyarthi.org'),
('address_bn', 'সিমুরালী, নদীয়া, পশ্চিমবঙ্গ ৭৪১২৪৮'),
('address_en', 'Simurali, Nadia, West Bengal 741248'),
('president_name', 'অরুণ কুমার সেন'),
('secretary_name', 'বরুণ চন্দ্র দে');

-- Mock Notices (Just 2 for UI testing)
INSERT INTO notices (title_bn, title_en, body_bn, body_en, published_at, is_pinned)
VALUES
('আগামী ১০ই মার্চ কোচিং সেন্টার বন্ধ থাকবে', 'Coaching Centre will be closed on March 10', 'বিশেষ কারণে আগামী ১০ই মার্চ সমস্ত ক্লাস বন্ধ থাকবে।', 'Due to special reasons, all classes will be closed on March 10.', NOW(), true),
('বইমেলা ২০২৬ এর প্রস্তুতি শুরু হয়েছে', 'Preparations for Book Fair 2026 have begun', 'আমাদের বার্ষিক বইমেলার প্রস্তুতি শুরু হয়েছে, বিস্তারিত শীঘ্রই জানানো হবে।', 'Preparations for our annual book fair have started, details will be announced soon.', NOW() - INTERVAL '2 days', false);

-- Mock Events
INSERT INTO events (slug, title_bn, title_en, description_bn, description_en, date, time, location, is_published)
VALUES
('annual-sports-2026', 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬', 'Annual Sports 2026', 'আমাদের ছাত্র-ছাত্রীদের বার্ষিক ক্রীড়া প্রতিযোগিতা।', 'Annual sports competition for our students.', CURRENT_DATE + INTERVAL '10 days', 'সকাল ৯টা', 'স্কুল মাঠ', true),
('rabindra-jayanti', 'রবীন্দ্র জয়ন্তী উদযাপন', 'Rabindra Jayanti Celebration', 'রবীন্দ্রনাথ ঠাকুরের জন্মবার্ষিকী উপলক্ষে বিশেষ অনুষ্ঠান।', 'Special cultural program on the occasion of Rabindranath Tagore''s birth anniversary.', CURRENT_DATE + INTERVAL '25 days', 'সন্ধ্যা ৬টা', 'ওপেন এয়ার স্টেজ', true);
