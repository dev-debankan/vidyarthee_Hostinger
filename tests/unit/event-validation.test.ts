import { describe, it, expect } from 'vitest';
import {
  validateImageBuffer,
  generateEventSlug,
  MAX_IMAGE_SIZE_BYTES,
} from '../../src/lib/events/validation';

describe('Event Image Upload Validation (Magic Bytes & Size)', () => {
  it('validates a correct JPEG image buffer with magic bytes 0xFF 0xD8 0xFF', () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const result = validateImageBuffer(jpegBuffer, 'sports.jpg');

    expect(result.valid).toBe(true);
    expect(result.mimeType).toBe('image/jpeg');
    expect(result.sanitizedFilename).toBe('sports.jpg');
    expect(result.error).toBeUndefined();
  });

  it('validates a correct PNG image buffer', () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = validateImageBuffer(pngBuffer, 'event_poster.png');

    expect(result.valid).toBe(true);
    expect(result.mimeType).toBe('image/png');
    expect(result.sanitizedFilename).toBe('event_poster.png');
  });

  it('rejects an image exceeding 2 MB limit', () => {
    const largeBuffer = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 100);
    // Add JPEG magic bytes at head
    largeBuffer[0] = 0xff;
    largeBuffer[1] = 0xd8;
    largeBuffer[2] = 0xff;

    const result = validateImageBuffer(largeBuffer, 'huge_photo.jpg');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds 2 MB limit');
  });

  it('rejects non-image files with invalid magic bytes', () => {
    const textBuffer = Buffer.from('this is plain text not an image');
    const result = validateImageBuffer(textBuffer, 'fake_photo.jpg');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('only JPEG, PNG, and WebP images are allowed');
  });
});

describe('Event Slug Generation', () => {
  it('generates URL-friendly event slugs', () => {
    const slug = generateEventSlug('বার্ষিক সাংস্কৃতিক অনুষ্ঠান', 'Annual Cultural Program 2026');
    expect(slug).toMatch(/^annual-cultural-program-2026-[a-z0-9]+$/);
  });
});
