/**
 * Site-wide constants.
 * ⚠ Do NOT add real institutional data here.
 * Use {{PLACEHOLDER}} markers in content/ files instead.
 */

export const SITE_NAME = "Bidyarthi Free Coaching Centre";
export const SITE_NAME_BN = "বিদ্যার্থী ফ্রি কোচিং সেন্টার";

export const LOCALES = ["bn", "en"] as const;
export const DEFAULT_LOCALE = "bn";

/** Upload limits (in bytes) */
export const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

/** Allowed MIME types */
export const ALLOWED_PDF_TYPES = ["application/pdf", "text/plain"] as const;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Gallery image dimensions */
export const GALLERY_DISPLAY_WIDTH = 1200;
export const GALLERY_THUMB_WIDTH = 400;

/** ISR revalidation intervals (in seconds) */
export const REVALIDATE_DEFAULT = 300; // 5 minutes
export const REVALIDATE_STATIC = false; // fully static
