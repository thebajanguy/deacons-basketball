
export function extractPhoneDigitsOnly(s?: string | null) { 
  return (s ?? '').replace(/\D+/g, '') || null;
}