import { createClient } from '@/lib/supabase/server';
import { MOCK_NOTICES } from '@/lib/mock/notices';
import { NoticeRow } from '@/types/database';

export interface GetPublicNoticesParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPublicNotices({
  category = 'All',
  search = '',
  page = 1,
  limit = 10,
}: GetPublicNoticesParams = {}) {
  const supabase = await createClient();
  const nowISO = new Date().toISOString();

  let query = supabase
    .from('notices')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .or(`expiry_date.is.null,expiry_date.gt.${nowISO}`);

  if (category && category !== 'All') {
    query = query.eq('category', category as NoticeRow['category']);
  }

  if (search && search.trim() !== '') {
    const q = `%${search.trim()}%`;
    query = query.or(`title_bn.ilike.${q},title_en.ilike.${q},body_bn.ilike.${q}`);
  }

  query = query
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    const fallbackNotices = MOCK_NOTICES.slice(0, limit) as unknown as NoticeRow[];
    return {
      notices: fallbackNotices,
      totalCount: fallbackNotices.length,
      totalPages: 1,
      currentPage: page,
    };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    notices: (data as NoticeRow[]) || [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getNoticeBySlugOrId(slugOrId: string): Promise<NoticeRow | null> {
  const supabase = await createClient();
  const nowISO = new Date().toISOString();

  // Try slug match first
  let { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('slug', slugOrId)
    .eq('is_published', true)
    .or(`expiry_date.is.null,expiry_date.gt.${nowISO}`)
    .single();

  if (!data) {
    // Fallback to id match if slugOrId is a valid UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      );
    if (isUuid) {
      const res = await supabase
        .from('notices')
        .select('*')
        .eq('id', slugOrId)
        .eq('is_published', true)
        .or(`expiry_date.is.null,expiry_date.gt.${nowISO}`)
        .single();
      data = res.data;
      error = res.error;
    }
  }

  if (error || !data) {
    return null;
  }

  return data as NoticeRow;
}

export async function getLatestNotices(limit: number = 5) {
  const res = await getPublicNotices({ page: 1, limit });
  return res.notices;
}
