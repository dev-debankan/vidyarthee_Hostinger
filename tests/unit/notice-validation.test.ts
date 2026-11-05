import { describe, it, expect } from 'vitest';
import {
  validateNoticeFileBuffer,
  sanitizeFilename,
  generateNoticeSlug,
  MAX_PDF_SIZE_BYTES,
  MAX_TXT_SIZE_BYTES,
} from '../../src/lib/notices/validation';

describe('Notice File Upload Validation (Magic Bytes & Size)', () => {
  it('validates a correct PDF file with %PDF- magic bytes', () => {
    // PDF Magic Bytes: %PDF-
    const pdfBuffer = Buffer.from('%PDF-1.7\n%sample pdf content');
    const result = validateNoticeFileBuffer(pdfBuffer, 'official-notice.pdf');

    expect(result.valid).toBe(true);
    expect(result.fileType).toBe('pdf');
    expect(result.sanitizedFilename).toBe('official-notice.pdf');
    expect(result.error).toBeUndefined();
  });

  it('rejects a PDF file that exceeds 10 MB limit', () => {
    const largePdfBuffer = Buffer.alloc(MAX_PDF_SIZE_BYTES + 1024);
    // Add %PDF- header at the beginning
    largePdfBuffer.write('%PDF-1.4');

    const result = validateNoticeFileBuffer(largePdfBuffer, 'large_document.pdf');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds 10 MB limit');
  });

  it('validates a UTF-8 text file containing Bengali text', () => {
    const bengaliText = 'বিদ্যার্থী ফ্রি কোচিং সেন্টার সিমুরালি ভর্তি বিজ্ঞপ্তি ২০২৬';
    const txtBuffer = Buffer.from(bengaliText, 'utf-8');

    const result = validateNoticeFileBuffer(txtBuffer, 'admission_bn.txt');

    expect(result.valid).toBe(true);
    expect(result.fileType).toBe('txt');
    expect(result.textBody).toBe(bengaliText);
    expect(result.sanitizedFilename).toBe('admission_bn.txt');
  });

  it('rejects a TXT file exceeding 200 KB limit', () => {
    const largeTxtBuffer = Buffer.alloc(MAX_TXT_SIZE_BYTES + 100, 0x41); // 'A's

    const result = validateNoticeFileBuffer(largeTxtBuffer, 'big_file.txt');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds 200 KB limit');
  });

  it('rejects text files containing binary null bytes', () => {
    // Buffer with embedded 0x00 null byte
    const binaryBuffer = Buffer.from([0x48, 0x65, 0x6c, 0x00, 0x6f]);

    const result = validateNoticeFileBuffer(binaryBuffer, 'fake.txt');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('binary null bytes detected');
  });
});

describe('Filename Sanitization', () => {
  it('sanitizes unsafe filenames and removes path traversal', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('passwd');
    expect(sanitizeFilename('my notice #1 (draft).pdf')).toBe('my_notice_1_draft_.pdf');
    expect(sanitizeFilename('ভর্তি-বিজ্ঞপ্তি.txt')).toBe('_-_.txt');
  });
});

describe('Notice Slug Generation', () => {
  it('generates URL-friendly slugs for English and Bengali titles', () => {
    const slugEn = generateNoticeSlug('ভর্তি বিজ্ঞপ্তি', 'Admission Notice 2026');
    expect(slugEn).toMatch(/^admission-notice-2026-[a-z0-9]+$/);

    const slugBn = generateNoticeSlug('বিশেষ ঘোষণা', '');
    expect(slugBn).toMatch(/^notice-[0-9]+-[a-z0-9]+$/);
  });
});
