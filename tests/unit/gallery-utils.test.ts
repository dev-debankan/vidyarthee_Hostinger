import { describe, it, expect } from 'vitest';
import {
  extractYouTubeId,
  PHOTO_CATEGORIES,
  VIDEO_CATEGORIES,
  PHOTO_CATEGORY_LABELS,
  VIDEO_CATEGORY_LABELS,
} from '@/lib/gallery/utils';

describe('Gallery Utils - extractYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from shortened youtu.be URL', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from shorts URL', () => {
    const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
    expect(extractYouTubeId(url)).toBe('dQw4w9WgXcQ');
  });

  it('returns null for invalid or empty URLs', () => {
    expect(extractYouTubeId('')).toBeNull();
    expect(extractYouTubeId('https://google.com')).toBeNull();
    expect(extractYouTubeId('https://youtube.com/watch?v=short')).toBeNull();
  });
});

describe('Gallery Utils - Categories & Labels', () => {
  it('contains 6 photo categories matching SITEMAP.md', () => {
    expect(PHOTO_CATEGORIES).toHaveLength(6);
    expect(PHOTO_CATEGORIES).toContain('Coaching');
    expect(PHOTO_CATEGORIES).toContain('Events');
    expect(PHOTO_CATEGORIES).toContain('Book Fair');
    expect(PHOTO_CATEGORIES).toContain('Kindergarten');
    expect(PHOTO_CATEGORIES).toContain('Dispensary & Health');
    expect(PHOTO_CATEGORIES).toContain('Cultural & Community');
  });

  it('contains 3 video categories matching SITEMAP.md', () => {
    expect(VIDEO_CATEGORIES).toHaveLength(3);
    expect(VIDEO_CATEGORIES).toContain('Events');
    expect(VIDEO_CATEGORIES).toContain('Cultural Programmes');
    expect(VIDEO_CATEGORIES).toContain('Activities');
  });

  it('has valid Bengali and English labels for all categories', () => {
    PHOTO_CATEGORIES.forEach((cat) => {
      expect(PHOTO_CATEGORY_LABELS[cat]).toBeDefined();
      expect(PHOTO_CATEGORY_LABELS[cat].bn).toBeTruthy();
      expect(PHOTO_CATEGORY_LABELS[cat].en).toBeTruthy();
    });

    VIDEO_CATEGORIES.forEach((cat) => {
      expect(VIDEO_CATEGORY_LABELS[cat]).toBeDefined();
      expect(VIDEO_CATEGORY_LABELS[cat].bn).toBeTruthy();
      expect(VIDEO_CATEGORY_LABELS[cat].en).toBeTruthy();
    });
  });
});
