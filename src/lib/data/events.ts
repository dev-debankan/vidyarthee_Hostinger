import { createClient } from '@/lib/supabase/server';
import { MOCK_EVENTS } from '@/lib/mock/events';
import { EventRow } from '@/types/database';

export interface GetPublicEventsParams {
  filter?: 'upcoming' | 'past' | 'all';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPublicEvents({
  filter = 'upcoming',
  category = 'All',
  search = '',
  page = 1,
  limit = 9,
}: GetPublicEventsParams = {}) {
  const supabase = await createClient();
  const todayDate = new Date().toISOString().slice(0, 10);

  let query = (supabase.from('events') as any)
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (category && category !== 'All') {
    query = query.eq('category', category as EventRow['category']);
  }

  if (filter === 'upcoming') {
    query = query.gte('date', todayDate).order('date', { ascending: true });
  } else if (filter === 'past') {
    query = query.lt('date', todayDate).order('date', { ascending: false });
  } else {
    query = query.order('date', { ascending: false });
  }

  if (search && search.trim() !== '') {
    const q = `%${search.trim()}%`;
    query = query.or(`title_bn.ilike.${q},title_en.ilike.${q},location.ilike.${q},description_bn.ilike.${q}`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    const fallbackEvents = MOCK_EVENTS.slice(0, limit) as unknown as EventRow[];
    return {
      events: fallbackEvents,
      totalCount: fallbackEvents.length,
      totalPages: 1,
      currentPage: page,
    };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    events: (data as EventRow[]) || [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function getEventBySlug(slugOrId: string): Promise<EventRow | null> {
  const supabase = await createClient();

  // Try matching slug first
  let { data, error } = await (supabase.from('events') as any)
    .select('*')
    .eq('slug', slugOrId)
    .eq('is_published', true)
    .single();

  if (!data) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      );
    if (isUuid) {
      const res = await (supabase.from('events') as any)
        .select('*')
        .eq('id', slugOrId)
        .eq('is_published', true)
        .single();
      data = res.data;
      error = res.error;
    }
  }

  if (error || !data) {
    return null;
  }

  return data as EventRow;
}

export async function getUpcomingEvents(limit: number = 3) {
  const res = await getPublicEvents({ filter: 'upcoming', page: 1, limit });
  return res.events;
}
