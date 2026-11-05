-- Migration 0005: Form Links Extension & Initial Seed Data

-- 1. Add slug and response_sheet_url columns to form_links
ALTER TABLE form_links ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE form_links ADD COLUMN IF NOT EXISTS response_sheet_url TEXT;

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS form_links_slug_idx ON form_links(slug);

-- 2. Seed initial 5 required form categories if they don't exist
INSERT INTO form_links (slug, title_bn, title_en, description_bn, description_en, google_form_url, response_sheet_url, is_active, sort_order)
VALUES
(
  'admission-application',
  'ভর্তি আবেদনপত্র',
  'Admission Application',
  'বিদ্যার্থী ফ্রি কোচিং সেন্টারে ভর্তি ইচ্ছুক ছাত্র-ছাত্রীদের জন্য অনলাইন আবেদনপত্র।',
  'Online admission application form for students seeking entry into Bidyarthi Free Coaching Centre.',
  'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE_ADMISSION/viewform',
  'https://docs.google.com/spreadsheets/d/1SAMPLE_ADMISSION_SHEET/edit',
  true,
  1
),
(
  'coaching-registration',
  'ফ্রি কোচিং রেজিস্ট্রেশন',
  'Free Coaching Registration',
  'ফ্রি কোচিং ক্লাসে অংশগ্রহণের জন্য প্রাথমিক নিবন্ধন ফরম।',
  'Initial registration form for attending free coaching classes.',
  'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE_COACHING/viewform',
  'https://docs.google.com/spreadsheets/d/1SAMPLE_COACHING_SHEET/edit',
  true,
  2
),
(
  'membership-application',
  'সদস্যপদ আবেদন',
  'Membership Application',
  'বিদ্যার্থী কোচিং সেন্টারের সাধারণ বা আজীবন সদস্যপদের আবেদনপত্র।',
  'Application form for general or life membership of Bidyarthi Coaching Centre.',
  'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE_MEMBERSHIP/viewform',
  'https://docs.google.com/spreadsheets/d/1SAMPLE_MEMBERSHIP_SHEET/edit',
  true,
  3
),
(
  'volunteer-registration',
  'স্বেচ্ছাসেবক নিবন্ধন',
  'Volunteer Registration',
  'আমাদের শিক্ষা ও সামাজিক সেবা কার্যক্রমে স্বেচ্ছাসেবক হিসেবে যোগ দেওয়ার ফরম।',
  'Form to join as a volunteer in our educational and social welfare activities.',
  'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE_VOLUNTEER/viewform',
  'https://docs.google.com/spreadsheets/d/1SAMPLE_VOLUNTEER_SHEET/edit',
  true,
  4
),
(
  'other-forms',
  'অন্যান্য ফরম ও আবেদন',
  'Other Forms',
  'অন্যান্য বিবিধ সেবা, সাহায্য ও আবেদন সংক্রান্ত ফর্ম।',
  'Miscellaneous service, relief, and application forms.',
  'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE_OTHER/viewform',
  'https://docs.google.com/spreadsheets/d/1SAMPLE_OTHER_SHEET/edit',
  true,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  title_bn = EXCLUDED.title_bn,
  title_en = EXCLUDED.title_en,
  description_bn = EXCLUDED.description_bn,
  description_en = EXCLUDED.description_en;
