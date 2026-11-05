import { describe, it, expect } from 'vitest';

describe('Contact Page & Settings Helpers', () => {
  it('formats tel: href links correctly from formatted phone numbers', () => {
    const rawPhone = '+91 98765 43210';
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
    expect(cleanPhone).toBe('+919876543210');
  });

  it('handles phone numbers without spaces or special characters', () => {
    const rawPhone = '9876543210';
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
    expect(cleanPhone).toBe('9876543210');
  });
});
