import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminHighlightsClient } from './highlights-client';
import { HighlightRow } from '@/types/database';

export const metadata = {
  title: 'Manage Highlights | Admin Dashboard',
};

export default async function AdminHighlightsPage() {
  const supabase = await createClient();

  const { data: highlights, error } = await (supabase.from('highlights') as any)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin highlights:', error);
  }

  return <AdminHighlightsClient initialHighlights={(highlights as HighlightRow[]) || []} />;
}
