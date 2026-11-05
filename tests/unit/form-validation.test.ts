import { describe, it, expect } from 'vitest';
import {
  validateGoogleFormUrl,
  validateGoogleSheetUrl,
  getEmbeddableGoogleFormUrl,
} from '@/lib/forms/validation';

describe('Form Validation - validateGoogleFormUrl', () => {
  it('accepts valid https docs.google.com/forms URLs', () => {
    const res = validateGoogleFormUrl(
      'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE/viewform'
    );
    expect(res.valid).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('accepts valid https forms.gle URLs', () => {
    const res = validateGoogleFormUrl('https://forms.gle/abc123xyz');
    expect(res.valid).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('rejects http URLs', () => {
    const res = validateGoogleFormUrl(
      'http://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE/viewform'
    );
    expect(res.valid).toBe(false);
    expect(res.error).toContain('must start with https://');
  });

  it('rejects URLs from other domains', () => {
    const res = validateGoogleFormUrl('https://example.com/form');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('docs.google.com/forms or forms.gle');
  });

  it('rejects empty or non-string input', () => {
    expect(validateGoogleFormUrl('').valid).toBe(false);
  });
});

describe('Form Validation - validateGoogleSheetUrl', () => {
  it('accepts valid https docs.google.com/spreadsheets URLs', () => {
    const res = validateGoogleSheetUrl(
      'https://docs.google.com/spreadsheets/d/1SAMPLE_SHEET/edit'
    );
    expect(res.valid).toBe(true);
  });

  it('allows empty optional sheet URL', () => {
    expect(validateGoogleSheetUrl('').valid).toBe(true);
  });

  it('rejects non-spreadsheet URLs', () => {
    const res = validateGoogleSheetUrl('https://docs.google.com/document/d/123/edit');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('docs.google.com/spreadsheets');
  });
});

describe('Form Validation - getEmbeddableGoogleFormUrl', () => {
  it('appends embedded=true query parameter to Google Form URL', () => {
    const input = 'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE/viewform';
    const output = getEmbeddableGoogleFormUrl(input);
    expect(output).toContain('embedded=true');
  });

  it('preserves embedded=true parameter if already present', () => {
    const input =
      'https://docs.google.com/forms/d/e/1FAIpQLSfSAMPLE/viewform?embedded=true';
    const output = getEmbeddableGoogleFormUrl(input);
    expect(output).toBe(input);
  });
});
