import { createClient } from '@/lib/supabase/server';

export interface ContactDetails {
  phone: string;
  email: string;
  address_bn: string;
  address_en: string;
  maps_embed_url: string;
  maps_url: string;
  facebook_url: string;
  youtube_url: string;
  hero_title_bn: string;
  hero_title_en: string;
  hero_subtitle_bn: string;
  hero_subtitle_en: string;
  intro_bn: string;
  intro_en: string;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from('site_settings') as any)
    .select('key, value');

  if (error) {
    return {};
  }

  const settings: Record<string, string> = {};
  if (data) {
    for (const item of data) {
      settings[item.key] = item.value;
    }
  }

  return settings;
}

export async function getContactDetails(): Promise<ContactDetails> {
  const settings = await getSiteSettings();

  const mapsQuery = 'Bidyarthi Free Coaching Centre, Simurali, Nadia, West Bengal 741248';

  return {
    phone: settings['phone'] || '+91 98765 43210',
    email: settings['email'] || 'info@bidyarthi.org',
    address_bn: settings['address_bn'] || 'সিমুরালী, নদীয়া, পশ্চিমবঙ্গ ৭৪১২ ৪৮',
    address_en: settings['address_en'] || 'Simurali, Nadia, West Bengal 741248',
    maps_embed_url:
      settings['maps_embed_url'] ||
      `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=15&output=embed`,
    maps_url:
      settings['maps_url'] ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
    facebook_url: settings['facebook_url'] || 'https://facebook.com',
    youtube_url: settings['youtube_url'] || 'https://youtube.com',
    hero_title_bn: settings['hero_title_bn'] || 'বিদ্যার্থী ফ্রি কোচিং সেন্টার',
    hero_title_en: settings['hero_title_en'] || 'Bidyarthi Free Coaching Centre',
    hero_subtitle_bn:
      settings['hero_subtitle_bn'] ||
      '১৯৮৭ সাল থেকে দুঃস্থ ও মেধাবী ছাত্র-ছাত্রীদের সেবায় নিয়োজিত একটি স্বেচ্ছাসেবী সমাজসেবামূলক প্রতিষ্ঠান।',
    hero_subtitle_en:
      settings['hero_subtitle_en'] ||
      'A voluntary social welfare organisation dedicated to serving underprivileged students since 1987.',
    intro_bn:
      settings['intro_bn'] ||
      'আমাদের মূল উদ্দেশ্য হল সমাজের সকল স্তরের শিশুদের জন্য বিনামূল্যে গুণমানসম্মত শিক্ষা সুনিশ্চিত করা এবং বিভিন্ন সমাজসেবামূলক কর্মকাণ্ডের মাধ্যমে শিমুরালী ও পার্শ্ববর্তী এলাকার সার্বিক উন্নতি সাধন করা।',
    intro_en:
      settings['intro_en'] ||
      'Our primary mission is to ensure quality free education for children from all sections of society and contribute to community development in Simurali and surrounding areas.',
  };
}
