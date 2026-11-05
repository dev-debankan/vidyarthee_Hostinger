export const PHOTO_CATEGORIES = [
  'Coaching',
  'Events',
  'Book Fair',
  'Kindergarten',
  'Dispensary & Health',
  'Cultural & Community',
] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

export const VIDEO_CATEGORIES = [
  'Events',
  'Cultural Programmes',
  'Activities',
] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, { bn: string; en: string }> = {
  Coaching: { bn: 'ফ্রি কোচিং', en: 'Coaching' },
  Events: { bn: 'অনুষ্ঠানসমূহ', en: 'Events' },
  'Book Fair': { bn: 'বইমেলা', en: 'Book Fair' },
  Kindergarten: { bn: 'শিশুশ্রেণি', en: 'Kindergarten' },
  'Dispensary & Health': { bn: 'চিকিৎসালয় ও স্বাস্থ্য', en: 'Dispensary & Health' },
  'Cultural & Community': { bn: 'সংস্কৃতিক ও সামাজিক', en: 'Cultural & Community' },
};

export const VIDEO_CATEGORY_LABELS: Record<VideoCategory, { bn: string; en: string }> = {
  Events: { bn: 'অনুষ্ঠানসমূহ', en: 'Events' },
  'Cultural Programmes': { bn: 'সাংস্কৃতিক অনুষ্ঠান', en: 'Cultural Programmes' },
  Activities: { bn: 'কার্যক্রম', en: 'Activities' },
};

/**
 * Extracts YouTube video ID from various video URL formats.
 * E.g.:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Client-side image compression/resize helper.
 * Resizes image down to max dimension (default 1920px) and converts to WebP blob.
 */
export async function compressImageToWebP(
  file: File,
  maxDimension: number = 1920,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2d context for image compression'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const compressedFile = new File([blob], `${nameWithoutExt}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
