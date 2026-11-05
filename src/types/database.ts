export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
        }
        Insert: {
          id: string
          email: string
        }
        Update: {
          id?: string
          email?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          id: string
          slug: string
          category: 'Latest' | 'Admission' | 'Event' | 'Announcement' | 'Important Information'
          title_bn: string
          title_en: string | null
          body_bn: string | null
          body_en: string | null
          file_url: string | null
          file_type: 'pdf' | 'txt' | 'null' | null
          file_size: number | null
          is_pinned: boolean
          is_published: boolean
          published_at: string
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug?: string
          category?: 'Latest' | 'Admission' | 'Event' | 'Announcement' | 'Important Information'
          title_bn: string
          title_en?: string | null
          body_bn?: string | null
          body_en?: string | null
          file_url?: string | null
          file_type?: 'pdf' | 'txt' | 'null' | null
          file_size?: number | null
          is_pinned?: boolean
          is_published?: boolean
          published_at?: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          category?: 'Latest' | 'Admission' | 'Event' | 'Announcement' | 'Important Information'
          title_bn?: string
          title_en?: string | null
          body_bn?: string | null
          body_en?: string | null
          file_url?: string | null
          file_type?: 'pdf' | 'txt' | 'null' | null
          file_size?: number | null
          is_pinned?: boolean
          is_published?: boolean
          published_at?: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          slug: string
          category: 'Educational' | 'Cultural' | 'Social Welfare' | 'Book Fair' | 'Community' | 'Special'
          title_bn: string
          title_en: string | null
          description_bn: string
          description_en: string | null
          date: string
          time: string
          location: string
          cover_image_url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug?: string
          category?: 'Educational' | 'Cultural' | 'Social Welfare' | 'Book Fair' | 'Community' | 'Special'
          title_bn: string
          title_en?: string | null
          description_bn: string
          description_en?: string | null
          date: string
          time: string
          location: string
          cover_image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          category?: 'Educational' | 'Cultural' | 'Social Welfare' | 'Book Fair' | 'Community' | 'Special'
          title_bn?: string
          title_en?: string | null
          description_bn?: string
          description_en?: string | null
          date?: string
          time?: string
          location?: string
          cover_image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          image_url: string
          thumb_url: string
          caption_bn: string | null
          caption_en: string | null
          category: string
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          thumb_url: string
          caption_bn?: string | null
          caption_en?: string | null
          category: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          thumb_url?: string
          caption_bn?: string | null
          caption_en?: string | null
          category?: string
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      gallery_videos: {
        Row: {
          id: string
          title_bn: string
          title_en: string | null
          youtube_url: string
          youtube_id: string
          category: 'Events' | 'Cultural Programmes' | 'Activities'
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title_bn: string
          title_en?: string | null
          youtube_url: string
          youtube_id: string
          category: 'Events' | 'Cultural Programmes' | 'Activities'
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title_bn?: string
          title_en?: string | null
          youtube_url?: string
          youtube_id?: string
          category?: 'Events' | 'Cultural Programmes' | 'Activities'
          sort_order?: number
          is_published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      form_links: {
        Row: {
          id: string
          slug: string | null
          title_bn: string
          title_en: string | null
          description_bn: string | null
          description_en: string | null
          google_form_url: string
          response_sheet_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug?: string | null
          title_bn: string
          title_en?: string | null
          description_bn?: string | null
          description_en?: string | null
          google_form_url: string
          response_sheet_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string | null
          title_bn?: string
          title_en?: string | null
          description_bn?: string | null
          description_en?: string | null
          google_form_url?: string
          response_sheet_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          id: string
          title_bn: string
          title_en: string | null
          description_bn: string
          description_en: string | null
          icon: string | null
          link: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title_bn: string
          title_en?: string | null
          description_bn: string
          description_en?: string | null
          icon?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title_bn?: string
          title_en?: string | null
          description_bn?: string
          description_en?: string | null
          icon?: string | null
          link?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type NoticeRow = Database['public']['Tables']['notices']['Row']
export type NoticeInsert = Database['public']['Tables']['notices']['Insert']
export type EventRow = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type GalleryItemRow = Database['public']['Tables']['gallery_items']['Row']
export type GalleryVideoRow = Database['public']['Tables']['gallery_videos']['Row']
export type FormLinkRow = Database['public']['Tables']['form_links']['Row']
export type HighlightRow = Database['public']['Tables']['highlights']['Row']
export type SiteSettingRow = Database['public']['Tables']['site_settings']['Row']
