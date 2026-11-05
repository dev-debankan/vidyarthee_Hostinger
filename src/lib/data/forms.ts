import { createClient } from '@/lib/supabase/server';
import { FormLinkRow } from '@/types/database';

export async function getPublicFormLinks(): Promise<FormLinkRow[]> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from('form_links') as any)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public form links:', error);
    return [];
  }

  return (data as FormLinkRow[]) || [];
}

export async function getPublicFormLinkBySlug(slug: string): Promise<FormLinkRow | null> {
  const supabase = await createClient();

  // Try matching slug first
  let { data, error } = await (supabase.from('form_links') as any)
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      const res = await (supabase.from('form_links') as any)
        .select('*')
        .eq('id', slug)
        .single();
      data = res.data;
      error = res.error;
    }
  }

  if (error || !data) {
    return null;
  }

  return data as FormLinkRow;
}

export async function getAdminFormLinks(): Promise<FormLinkRow[]> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from('form_links') as any)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin form links:', error);
    return [];
  }

  return (data as FormLinkRow[]) || [];
}
