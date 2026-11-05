'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createHighlightAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin authentication required' };
    }

    const title_bn = formData.get('title_bn') as string;
    const title_en = (formData.get('title_en') as string) || null;
    const description_bn = formData.get('description_bn') as string;
    const description_en = (formData.get('description_en') as string) || null;
    const icon = (formData.get('icon') as string) || 'BookOpen';
    const link = (formData.get('link') as string) || null;
    const is_active = formData.get('is_active') !== 'false';

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    if (!description_bn || description_bn.trim() === '') {
      return { success: false, error: 'Bengali Description is required' };
    }

    const { error: dbError } = await (supabase.from('highlights') as any).insert({
      title_bn,
      title_en,
      description_bn,
      description_en,
      icon,
      link,
      is_active,
      sort_order: 0,
    });

    if (dbError) {
      console.error('Database insert error for highlight:', dbError);
      return { success: false, error: `Failed to create highlight: ${dbError.message}` };
    }

    revalidatePath('/admin/highlights');
    revalidatePath('/');
    revalidatePath('/bn');
    revalidatePath('/en');

    return { success: true, message: 'Highlight created successfully' };
  } catch (err: any) {
    console.error('Unexpected error in createHighlightAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function updateHighlightAction(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const title_bn = formData.get('title_bn') as string;
    const title_en = (formData.get('title_en') as string) || null;
    const description_bn = formData.get('description_bn') as string;
    const description_en = (formData.get('description_en') as string) || null;
    const icon = (formData.get('icon') as string) || 'BookOpen';
    const link = (formData.get('link') as string) || null;
    const is_active = formData.get('is_active') === 'true' || formData.get('is_active') === 'on';

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    if (!description_bn || description_bn.trim() === '') {
      return { success: false, error: 'Bengali Description is required' };
    }

    const { error: updateError } = await (supabase.from('highlights') as any)
      .update({
        title_bn,
        title_en,
        description_bn,
        description_en,
        icon,
        link,
        is_active,
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: `Failed to update highlight: ${updateError.message}` };
    }

    revalidatePath('/admin/highlights');
    revalidatePath('/');
    revalidatePath('/bn');
    revalidatePath('/en');

    return { success: true, message: 'Highlight updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function toggleHighlightAction(id: string, currentStatus: boolean) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('highlights') as any)
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/highlights');
    revalidatePath('/');

    return {
      success: true,
      message: !currentStatus ? 'Highlight activated' : 'Highlight deactivated',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update status' };
  }
}

export async function deleteHighlightAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('highlights') as any).delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/highlights');
    revalidatePath('/');

    return { success: true, message: 'Highlight deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete highlight' };
  }
}

export async function reorderHighlightsAction(orderedIds: string[]) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await (supabase.from('highlights') as any)
        .update({ sort_order: index })
        .eq('id', id);
    }

    revalidatePath('/admin/highlights');
    revalidatePath('/');

    return { success: true, message: 'Highlights reordered successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reorder highlights' };
  }
}
