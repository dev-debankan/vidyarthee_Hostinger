/**
 * Validates Google Form URLs.
 * Requirements: Must be https and on domain docs.google.com/forms or forms.gle
 */
export function validateGoogleFormUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmed = url.trim();

  if (!trimmed.startsWith('https://')) {
    return { valid: false, error: 'Form URL must start with https://' };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    const isDocsForms = host === 'docs.google.com' && path.startsWith('/forms');
    const isFormsGle = host === 'forms.gle';

    if (!isDocsForms && !isFormsGle) {
      return {
        valid: false,
        error: 'URL must be hosted on docs.google.com/forms or forms.gle',
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validates Google Sheet Response URLs (admin-only).
 * Requirements: Must start with https:// and be on docs.google.com/spreadsheets
 */
export function validateGoogleSheetUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: true }; // optional field
  }

  const trimmed = url.trim();
  if (trimmed === '') return { valid: true };

  if (!trimmed.startsWith('https://')) {
    return { valid: false, error: 'Sheet URL must start with https://' };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    const isSpreadsheets =
      host === 'docs.google.com' && path.startsWith('/spreadsheets');

    if (!isSpreadsheets) {
      return {
        valid: false,
        error: 'URL must be a valid Google Sheets URL (docs.google.com/spreadsheets)',
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Converts a valid Google Form URL into an embeddable URL with ?embedded=true
 */
export function getEmbeddableGoogleFormUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // If it's forms.gle, we return as is since forms.gle redirects to docs.google.com/forms
    if (parsed.hostname.toLowerCase() === 'forms.gle') {
      if (!parsed.searchParams.has('embedded')) {
        parsed.searchParams.set('embedded', 'true');
      }
      return parsed.toString();
    }

    // Ensure /viewform endpoint has ?embedded=true
    if (!parsed.searchParams.has('embedded')) {
      parsed.searchParams.set('embedded', 'true');
    }

    return parsed.toString();
  } catch {
    return trimmed;
  }
}
