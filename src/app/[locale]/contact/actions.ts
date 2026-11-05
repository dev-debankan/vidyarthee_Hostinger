'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactFormAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || null;
    const message = formData.get('message') as string;

    if (!name || name.trim() === '') {
      return { success: false, error: 'Name is required' };
    }

    if (!email || email.trim() === '' || !email.includes('@')) {
      return { success: false, error: 'Valid email address is required' };
    }

    if (!message || message.trim() === '') {
      return { success: false, error: 'Message content is required' };
    }

    const { error: dbError } = await (supabase.from('messages') as any).insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      is_read: false,
    });

    if (dbError) {
      console.error('Contact form submission error:', dbError);
      return { success: false, error: 'Failed to submit message. Please try again later.' };
    }

    return {
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
    };
  } catch (err: any) {
    console.error('Unexpected error in submitContactFormAction:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
