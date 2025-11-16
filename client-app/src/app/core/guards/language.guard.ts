// core/guards/language.guard.ts
import { CanMatchFn, UrlSegment } from '@angular/router';

export function languageCanMatch(supported: readonly string[], fallback: string): CanMatchFn {
  return (route, segments: UrlSegment[]) => {
    const lang = segments[0]?.path?.toLowerCase();
    if (!lang) return false;
    if (supported.includes(lang)) return true;
    // If unsupported, rewrite to fallback (keeps the rest of the path if present)
    const rest = segments.slice(1).map(s => s.path).join('/');
    window.location.replace(`/${fallback}/${rest}`);
    return false;
  };
}
