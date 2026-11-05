import { createClient } from '@/lib/supabase/server';
import { GalleryItemRow, GalleryVideoRow } from '@/types/database';

export interface GetPublicGalleryPhotosParams {
  category?: string;
  page?: number;
  limit?: number;
}

export async function getPublicGalleryPhotos({
  category = 'All',
  page = 1,
  limit = 12,
}: GetPublicGalleryPhotosParams = {}) {
  const supabase = await createClient();

  let query = (supabase.from('gallery_items') as any)
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.warn('Unable to load gallery photos; showing the empty state:', error);
    return { photos: [] as GalleryItemRow[], totalCount: 0, totalPages: 1, currentPage: page };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    photos: (data as GalleryItemRow[]) || [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export interface GetPublicGalleryVideosParams {
  category?: string;
  page?: number;
  limit?: number;
}

export async function getPublicGalleryVideos({
  category = 'All',
  page = 1,
  limit = 9,
}: GetPublicGalleryVideosParams = {}) {
  const supabase = await createClient();

  let query = (supabase.from('gallery_videos') as any)
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.warn('Unable to load gallery videos; showing the empty state:', error);
    return { videos: [] as GalleryVideoRow[], totalCount: 0, totalPages: 1, currentPage: page };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    videos: (data as GalleryVideoRow[]) || [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getAdminGalleryPhotos() {
  const supabase = await createClient();
  const { data, error } = await (supabase.from('gallery_items') as any)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin gallery photos:', error);
    return [];
  }

  return (data as GalleryItemRow[]) || [];
}

export async function getAdminGalleryVideos() {
  const supabase = await createClient();
  const { data, error } = await (supabase.from('gallery_videos') as any)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin gallery videos:', error);
    return [];
  }

  return (data as GalleryVideoRow[]) || [];
}
