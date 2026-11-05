import { z } from 'zod';

export const NOTICE_CATEGORIES = [
  'Latest',
  'Admission',
  'Event',
  'Announcement',
  'Important Information',
] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_TXT_SIZE_BYTES = 200 * 1024; // 200 KB

export const NoticeInputSchema = z.object({
  title_bn: z.string().min(1, 'Title in Bengali is required'),
  title_en: z.string().optional().nullable(),
  category: z.enum(NOTICE_CATEGORIES, {
    errorMap: () => ({ message: 'Invalid category selected' }),
  }),
  published_at: z.string().min(1, 'Publish date is required'),
  expiry_date: z.string().optional().nullable(),
  is_pinned: z.boolean().default(false),
  is_published: z.boolean().default(true),
  slug: z.string().optional().nullable(),
  content_type: z.enum(['text', 'pdf', 'txt']),
  body_bn: z.string().optional().nullable(),
  body_en: z.string().optional().nullable(),
});

export type NoticeInput = z.infer<typeof NoticeInputSchema>;

export interface ValidationResult {
  valid: boolean;
  fileType?: 'pdf' | 'txt';
  textBody?: string;
  sanitizedFilename?: string;
  error?: string;
}

/**
 * Validates real file type using magic bytes and size rules.
 * - PDF: Must start with %PDF- (magic bytes) and be <= 10 MB.
 * - TXT: Must be UTF-8 string without binary null bytes and <= 200 KB.
 */
export function validateNoticeFileBuffer(
  buffer: Buffer | Uint8Array,
  originalFilename: string
): ValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File buffer is empty' };
  }

  const sanitizedFilename = sanitizeFilename(originalFilename);

  // Check PDF Magic Bytes (%PDF-)
  const isPdfMagic =
    buffer.length >= 5 &&
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 && // F
    buffer[4] === 0x2d; // -

  if (isPdfMagic) {
    if (buffer.length > MAX_PDF_SIZE_BYTES) {
      return {
        valid: false,
        error: `PDF file size exceeds 10 MB limit (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`,
      };
    }
    return {
      valid: true,
      fileType: 'pdf',
      sanitizedFilename,
    };
  }

  // Check TXT file validation
  if (buffer.length > MAX_TXT_SIZE_BYTES) {
    return {
      valid: false,
      error: `TXT file size exceeds 200 KB limit (${(buffer.length / 1024).toFixed(2)} KB)`,
    };
  }

  // Check for binary null bytes
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0) {
      return {
        valid: false,
        error: 'Invalid file content: binary null bytes detected (not a plain text file)',
      };
    }
  }

  // Verify UTF-8 decoding
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const textBody = decoder.decode(buffer);
    return {
      valid: true,
      fileType: 'txt',
      textBody,
      sanitizedFilename,
    };
  } catch {
    return {
      valid: false,
      error: 'Invalid TXT file: content is not valid UTF-8 text',
    };
  }
}

/**
 * Sanitizes filename to prevent directory traversal and path manipulation
 */
export function sanitizeFilename(filename: string): string {
  const basename = filename.replace(/^.*[\\/]/, ''); // remove directory path
  const sanitized = basename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_') // replace unsafe chars with underscore
    .replace(/_{2,}/g, '_'); // avoid multiple underscores
  return sanitized || 'file';
}

/**
 * Generates a unique storage path for notice files
 */
export function generateStoragePath(sanitizedFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `notices/${timestamp}-${random}-${sanitizedFilename}`;
}

/**
 * Generates a URL-friendly slug from title
 */
export function generateNoticeSlug(titleBn: string, titleEn?: string | null): string {
  const base = (titleEn || titleBn)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const suffix = Math.random().toString(36).substring(2, 6);
  if (!base) {
    return `notice-${Date.now()}-${suffix}`;
  }
  return `${base}-${suffix}`;
}
