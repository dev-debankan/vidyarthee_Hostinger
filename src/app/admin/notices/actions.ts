'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  NoticeCategory,
  validateNoticeFileBuffer,
  generateStoragePath,
  generateNoticeSlug,
} from '@/lib/notices/validation';

export async function createNoticeAction(formData: FormData) {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin authentication required' };
    }

    const title_bn = formData.get('title_bn') as string;
    const title_en = (formData.get('title_en') as string) || null;
    const category = (formData.get('category') as NoticeCategory) || 'Latest';
    const published_at = (formData.get('published_at') as string) || new Date().toISOString();
    const expiry_date = (formData.get('expiry_date') as string) || null;
    const is_pinned = formData.get('is_pinned') === 'true' || formData.get('is_pinned') === 'on';
    const is_published = formData.get('is_published') !== 'false';
    const content_type = formData.get('content_type') as 'pdf' | 'txt' | 'text';

    let body_bn = (formData.get('body_bn') as string) || null;
    const body_en = (formData.get('body_en') as string) || null;
    let file_url: string | null = null;
    let file_type: 'pdf' | 'txt' | null = null;
    let file_size: number | null = null;

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    const file = formData.get('file') as File | null;

    if (content_type === 'pdf' || content_type === 'txt') {
      if (!file || file.size === 0) {
        return { success: false, error: `Please select a valid ${content_type.toUpperCase()} file to upload` };
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const validation = validateNoticeFileBuffer(buffer, file.name);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const storagePath = generateStoragePath(validation.sanitizedFilename!);
      const { error: uploadError } = await supabase.storage
        .from('notice-files')
        .upload(storagePath, buffer, {
          contentType: validation.fileType === 'pdf' ? 'application/pdf' : 'text/plain; charset=utf-8',
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return { success: false, error: `Failed to upload file: ${uploadError.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from('notice-files')
        .getPublicUrl(storagePath);

      file_url = publicUrlData.publicUrl;
      file_type = validation.fileType || null;
      file_size = buffer.length;

      if (validation.fileType === 'txt' && validation.textBody) {
        // As per spec: .txt is read as UTF-8, stored as a text body in DB
        body_bn = validation.textBody;
      }
    } else if (content_type === 'text') {
      if (!body_bn || body_bn.trim() === '') {
        return { success: false, error: 'Text content is required when choosing pasted text' };
      }
    }

    const slug = generateNoticeSlug(title_bn, title_en);

    const { error: dbError } = await (supabase.from('notices') as any).insert({
      slug,
      title_bn,
      title_en,
      category,
      body_bn,
      body_en,
      file_url,
      file_type,
      file_size,
      is_pinned,
      is_published,
      published_at,
      expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null,
    });

    if (dbError) {
      console.error('Database insert error:', dbError);
      return { success: false, error: `Failed to create notice: ${dbError.message}` };
    }

    revalidatePath('/admin/notices');
    revalidatePath('/notices');
    revalidatePath('/');
    revalidatePath('/bn/notices');
    revalidatePath('/en/notices');

    return { success: true, message: 'Notice created successfully' };
  } catch (err: any) {
    console.error('Unexpected error in createNoticeAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function updateNoticeAction(id: string, formData: FormData) {
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
    const category = (formData.get('category') as NoticeCategory) || 'Latest';
    const published_at = formData.get('published_at') as string;
    const expiry_date = (formData.get('expiry_date') as string) || null;
    const is_pinned = formData.get('is_pinned') === 'true' || formData.get('is_pinned') === 'on';
    const is_published = formData.get('is_published') === 'true' || formData.get('is_published') === 'on';
    const content_type = formData.get('content_type') as 'pdf' | 'txt' | 'text';

    let body_bn = (formData.get('body_bn') as string) || null;
    const body_en = (formData.get('body_en') as string) || null;

    if (!title_bn || title_bn.trim() === '') {
      return { success: false, error: 'Bengali Title is required' };
    }

    const { data: existingNotice } = await (supabase.from('notices') as any)
      .select('*')
      .eq('id', id)
      .single();

    let file_url = existingNotice?.file_url || null;
    let file_type = existingNotice?.file_type || null;
    let file_size = existingNotice?.file_size || null;

    const file = formData.get('file') as File | null;

    if (file && file.size > 0 && (content_type === 'pdf' || content_type === 'txt')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const validation = validateNoticeFileBuffer(buffer, file.name);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const storagePath = generateStoragePath(validation.sanitizedFilename!);
      const { error: uploadError } = await supabase.storage
        .from('notice-files')
        .upload(storagePath, buffer, {
          contentType: validation.fileType === 'pdf' ? 'application/pdf' : 'text/plain; charset=utf-8',
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: `Failed to upload file: ${uploadError.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from('notice-files')
        .getPublicUrl(storagePath);

      file_url = publicUrlData.publicUrl;
      file_type = validation.fileType || null;
      file_size = buffer.length;

      if (validation.fileType === 'txt' && validation.textBody) {
        body_bn = validation.textBody;
      }
    } else if (content_type === 'text') {
      file_url = null;
      file_type = null;
      file_size = null;
    }

    const { error: updateError } = await (supabase.from('notices') as any)
      .update({
        title_bn,
        title_en,
        category,
        body_bn,
        body_en,
        file_url,
        file_type,
        file_size,
        is_pinned,
        is_published,
        published_at: published_at ? new Date(published_at).toISOString() : new Date().toISOString(),
        expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: `Failed to update notice: ${updateError.message}` };
    }

    revalidatePath('/admin/notices');
    revalidatePath('/notices');
    revalidatePath('/');
    revalidatePath('/bn/notices');
    revalidatePath('/en/notices');

    return { success: true, message: 'Notice updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

export async function deleteNoticeAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('notices') as any).delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/notices');
    revalidatePath('/notices');
    revalidatePath('/');

    return { success: true, message: 'Notice deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete notice' };
  }
}

export async function togglePublishNoticeAction(id: string, currentPublished: boolean) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('notices') as any)
      .update({ is_published: !currentPublished, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/notices');
    revalidatePath('/notices');
    revalidatePath('/');

    return {
      success: true,
      message: !currentPublished ? 'Notice published' : 'Notice unpublished',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update publish state' };
  }
}

export async function togglePinNoticeAction(id: string, currentPinned: boolean) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await (supabase.from('notices') as any)
      .update({ is_pinned: !currentPinned, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/notices');
    revalidatePath('/notices');
    revalidatePath('/');

    return {
      success: true,
      message: !currentPinned ? 'Notice pinned to top' : 'Notice unpinned',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update pin state' };
  }
}
