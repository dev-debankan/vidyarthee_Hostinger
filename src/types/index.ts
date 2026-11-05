export interface HighlightItem {
  id: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  icon: string;
  link: string;
  sort_order: number;
}

export interface NoticeItem {
  id: string;
  slug?: string;
  category?: string;
  title_bn: string;
  title_en?: string | null;
  body_bn?: string | null;
  body_en?: string | null;
  file_url?: string | null;
  file_type?: "pdf" | "txt" | "null" | null;
  file_size?: number | null;
  is_pinned: boolean;
  published_at: string;
}

export interface EventItem {
  id: string;
  slug: string;
  category?: string;
  title_bn: string;
  title_en?: string | null;
  description_bn: string;
  description_en?: string | null;
  date: string;
  time?: string;
  time_bn?: string;
  time_en?: string;
  location?: string;
  location_bn?: string;
  location_en?: string;
  cover_image_url?: string | null;
  is_published: boolean;
}

export interface LeadershipMessage {
  id: string;
  role: "president" | "secretary";
  name_bn: string;
  name_en: string;
  title_bn: string;
  title_en: string;
  image_url?: string;
  excerpt_bn: string;
  excerpt_en: string;
  full_message_bn: string;
  full_message_en: string;
}
