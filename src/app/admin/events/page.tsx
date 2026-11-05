import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminEventsClient } from './events-client';

export const metadata = {
  title: 'Manage Events | Admin Dashboard',
};

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await (supabase.from('events') as any)
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching admin events:', error);
  }

  return <AdminEventsClient initialEvents={events || []} />;
}
