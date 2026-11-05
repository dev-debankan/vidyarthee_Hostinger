import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminNoticesClient } from './notices-client';

export const metadata = {
  title: 'Manage Notices | Admin Dashboard',
};

export default async function AdminNoticesPage() {
  const supabase = await createClient();

  const { data: notices, error } = await supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin notices:', error);
  }

  return <AdminNoticesClient initialNotices={notices || []} />;
}
