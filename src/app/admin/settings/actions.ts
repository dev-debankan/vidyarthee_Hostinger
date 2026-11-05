'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin authentication required' };
    }

    const settingsToUpdate: Record<string, string> = {};

    // Keys to extract from text inputs
    const textKeys = [
      'phone',
      'email',
      'address_bn',
      'address_en',
      'maps_embed_url',
      'facebook_url',
      'youtube_url',
      'hero_title_bn',
      'hero_title_en',
      'hero_subtitle_bn',
      'hero_subtitle_en',
      'intro_bn',
      'intro_en',
      'president_name_bn',
      'president_name_en',
      'president_title_bn',
      'president_title_en',
      'president_excerpt_bn',
      'president_excerpt_en',
      'president_full_bn',
      'president_full_en',
      'secretary_name_bn',
      'secretary_name_en',
      'secretary_title_bn',
      'secretary_title_en',
      'secretary_excerpt_bn',
      'secretary_excerpt_en',
      'secretary_full_bn',
      'secretary_full_en',
    ];

    for (const key of textKeys) {
      const val = formData.get(key);
      if (val !== null) {
        settingsToUpdate[key] = val as string;
      }
    }

    // Handle President Photo Upload
    const presidentPhoto = formData.get('president_photo') as File | null;
    if (presidentPhoto && presidentPhoto.size > 0) {
      const buffer = Buffer.from(await presidentPhoto.arrayBuffer());
      const uniqueName = `president_${Date.now()}_${presidentPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { error: uploadErr } = await supabase.storage
        .from('site-photos')
        .upload(uniqueName, buffer, {
          contentType: presidentPhoto.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        return { success: false, error: `Failed to upload President photo: ${uploadErr.message}` };
      }

      const { data: pubData } = supabase.storage
        .from('site-photos')
        .getPublicUrl(uniqueName);

      settingsToUpdate['president_image_url'] = pubData.publicUrl;
    }

    // Handle Secretary Photo Upload
    const secretaryPhoto = formData.get('secretary_photo') as File | null;
    if (secretaryPhoto && secretaryPhoto.size > 0) {
      const buffer = Buffer.from(await secretaryPhoto.arrayBuffer());
      const uniqueName = `secretary_${Date.now()}_${secretaryPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { error: uploadErr } = await supabase.storage
        .from('site-photos')
        .upload(uniqueName, buffer, {
          contentType: secretaryPhoto.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        return { success: false, error: `Failed to upload Secretary photo: ${uploadErr.message}` };
      }

      const { data: pubData } = supabase.storage
        .from('site-photos')
        .getPublicUrl(uniqueName);

      settingsToUpdate['secretary_image_url'] = pubData.publicUrl;
    }

    // Upsert into site_settings
    for (const [key, value] of Object.entries(settingsToUpdate)) {
      const { error } = await (supabase.from('site_settings') as any)
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        return { success: false, error: `Failed to save setting ${key}: ${error.message}` };
      }
    }

    revalidatePath('/admin/settings');
    revalidatePath('/contact');
    revalidatePath('/');
    revalidatePath('/bn');
    revalidatePath('/en');
    revalidatePath('/bn/contact');
    revalidatePath('/en/contact');

    return { success: true, message: 'Site settings and leadership messages updated successfully' };
  } catch (err: any) {
    console.error('Unexpected error in updateSiteSettingsAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
