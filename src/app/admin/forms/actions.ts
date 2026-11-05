'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { validateGoogleFormUrl, validateGoogleSheetUrl } from '@/lib/forms/validation';

export async function updateFormLinkAction(id: string, formData: FormData) {
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
    const description_bn = (formData.get('description_bn') as string) || null;
    const description_en = (formData.get('description_en') as string) || null;
    const google_form_url = formData.get('google_form_url') as string;
    const response_sheet_url = (formData.get('response_sheet_url') as string) || null;
    const is_active = formData.get('is_active') === 'true' || formData.get('is_active') === 'on';

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    const formValidation = validateGoogleFormUrl(google_form_url);
    if (!formValidation.valid) {
      return { success: false, error: formValidation.error };
    }

    if (response_sheet_url) {
      const sheetValidation = validateGoogleSheetUrl(response_sheet_url);
      if (!sheetValidation.valid) {
        return { success: false, error: sheetValidation.error };
      }
    }

    const { data: savedForm, error: dbError } = await (supabase.from('form_links') as any)
      .update({
        title_bn,
        title_en,
        description_bn,
        description_en,
        google_form_url,
        response_sheet_url,
        is_active,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (dbError) {
      console.error('Database update error for form link:', dbError);
      return { success: false, error: `Failed to update form link: ${dbError.message}` };
    }

    revalidatePath('/forms');
    revalidatePath('/bn/forms');
    revalidatePath('/en/forms');

    return {
      success: true,
      message: 'Form link updated successfully',
      form: savedForm,
    };
  } catch (err: any) {
    console.error('Unexpected error in updateFormLinkAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function createFormLinkAction(formData: FormData) {
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
    const description_bn = (formData.get('description_bn') as string) || null;
    const description_en = (formData.get('description_en') as string) || null;
    const google_form_url = formData.get('google_form_url') as string;
    const response_sheet_url = (formData.get('response_sheet_url') as string) || null;
    const slug = formData.get('slug') as string;
    const is_active = formData.get('is_active') !== 'false';

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    if (!slug || slug.trim() === '') {
      return { success: false, error: 'Slug identifier is required' };
    }

    const formValidation = validateGoogleFormUrl(google_form_url);
    if (!formValidation.valid) {
      return { success: false, error: formValidation.error };
    }

    if (response_sheet_url) {
      const sheetValidation = validateGoogleSheetUrl(response_sheet_url);
      if (!sheetValidation.valid) {
        return { success: false, error: sheetValidation.error };
      }
    }

    const { data: savedForm, error: dbError } = await (supabase.from('form_links') as any)
      .insert({
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      title_bn,
      title_en,
      description_bn,
      description_en,
      google_form_url,
      response_sheet_url,
      is_active,
      sort_order: 10,
      })
      .select('*')
      .single();

    if (dbError) {
      console.error('Database insert error for form link:', dbError);
      return { success: false, error: `Failed to create form link: ${dbError.message}` };
    }

    revalidatePath('/forms');
    revalidatePath('/bn/forms');
    revalidatePath('/en/forms');

    return {
      success: true,
      message: 'Form link created successfully',
      form: savedForm,
    };
  } catch (err: any) {
    console.error('Unexpected error in createFormLinkAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function toggleActiveFormLinkAction(id: string, currentStatus: boolean) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('form_links') as any)
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/forms');
    revalidatePath('/bn/forms');
    revalidatePath('/en/forms');

    return {
      success: true,
      message: !currentStatus ? 'Form published (active)' : 'Form closed (inactive)',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update status' };
  }
}

export async function deleteFormLinkAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('form_links') as any).delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/forms');
    revalidatePath('/bn/forms');
    revalidatePath('/en/forms');

    return { success: true, message: 'Form link deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete form link' };
  }
}
