import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/database';
import { AdminMessagesClient } from './messages-client';

export const metadata = {
  title: 'Contact Messages | Admin Dashboard',
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Unable to load admin messages:', error);
  }

  return (
    <AdminMessagesClient
      initialMessages={(data || []) as Tables<'messages'>[]}
      loadError={error?.message || null}
    />
  );
}