import { createClient } from '@/lib/supabase/server'
import { MOCK_HIGHLIGHTS } from '@/lib/mock/highlights'

export async function getHighlights() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return MOCK_HIGHLIGHTS
  }

  return data && data.length > 0 ? data : MOCK_HIGHLIGHTS
}
