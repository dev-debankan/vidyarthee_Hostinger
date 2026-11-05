import { z } from 'zod';

export const EVENT_CATEGORIES = [
  'Educational',
  'Cultural',
  'Social Welfare',
  'Book Fair',
  'Community',
  'Special',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export const EventInputSchema = z.object({
  title_bn: z.string().min(1, 'Bengali Title is required'),
  title_en: z.string().optional().nullable(),
  category: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: 'Invalid category selected' }),
  }),
  description_bn: z.string().min(1, 'Bengali Description is required'),
  description_en: z.string().optional().nullable(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location/Venue is required'),
  is_published: z.boolean().default(true),
  slug: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
});

export type EventInput = z.infer<typeof EventInputSchema>;

export interface ImageValidationResult {
  valid: boolean;
  sanitizedFilename?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Validates cover image buffer (JPEG, PNG, WebP) and size <= 2MB
 */
export function validateImageBuffer(
  buffer: Buffer | Uint8Array,
  originalFilename: string
): ImageValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Image buffer is empty' };
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size exceeds 2 MB limit (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`,
    };
  }

  // Magic bytes check
  const isJpeg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 && // P
    buffer[2] === 0x4e && // N
    buffer[3] === 0x47; // G

  const isWebp =
    buffer.length >= 12 &&
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50; // P

  if (!isJpeg && !isPng && !isWebp) {
    return {
      valid: false,
      error: 'Invalid image format: only JPEG, PNG, and WebP images are allowed',
    };
  }

  const mimeType = isJpeg
    ? 'image/jpeg'
    : isPng
    ? 'image/png'
    : 'image/webp';

  const sanitizedFilename = originalFilename
    .replace(/^.*[\\/]/, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_') || 'image.jpg';

  return {
    valid: true,
    mimeType,
    sanitizedFilename,
  };
}

/**
 * Generates unique storage path for event cover images
 */
export function generateEventStoragePath(sanitizedFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `events/${timestamp}-${random}-${sanitizedFilename}`;
}

/**
 * Generates URL-friendly slug for events
 */
export function generateEventSlug(titleBn: string, titleEn?: string | null): string {
  const base = (titleEn || titleBn)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const suffix = Math.random().toString(36).substring(2, 6);
  if (!base) {
    return `event-${Date.now()}-${suffix}`;
  }
  return `${base}-${suffix}`;
}
