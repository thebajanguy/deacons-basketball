import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, startWith, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// Put OUTSIDE the class (top of file)
export type ActivityStatus = 'open' | 'coming_soon' | 'closed';
export interface Activity {
  id: string;
  country?: string,
  cityAndCountry?:string;          // country where camp is being held ... Barbados | United States | Trinidad | Abu Dabi
  interest: 'Basketball' ;
  editionLabel: string;            // e.g. "Fall Edition 2025"
  imageUrl: string;
  imageAlt: string;
  dates: { start: string; end: string }; // ISO strings ... yyyy-mm-dd
  venue: string;
  ages: string;                    // e.g. "11–18"
  schedule: string[];              // lines that form the "Days/Times" cell
  price?: { monthly: string | null, weekly: string | null, dropin: string | null };                   // e.g. "$250" or "$250/week"
  earlyBird?: { price: string | null; deadline: string | null }; // ISO date
  paymentMethods?: string[];       // e.g. ["1st Pay", "Cash"]
  status: ActivityStatus;              // controls CTA behavior
}
export const ACTIVITIES_KEYS = ['basketball'] as const;
export type ActivityKey = typeof ACTIVITIES_KEYS[number];



@Injectable({ providedIn: 'root' })
export class ActivityApi {
  private http = inject(HttpClient);
  private baseUrl = '/api'; // change if needed


  // --- Static fallback data (edit to your needs) ---
  Activities: Record<ActivityKey, Activity[]> = {
    basketball: [
      {
        id: 'bb-U10-bds',
        interest: 'Basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Rookie Academy',
        imageUrl: 'assets/img/pages/home/deacons-basketball-camp-basketball.png',
        imageAlt: 'Deacons Basketball Rookie Academy Program',
        dates: { start: '', end: '' },
        venue: 'The Hardcourts at Deacons',
        ages: 'Boys & Girls 11 & under',
        schedule: [
          'Mon–Fri 3:30 PM – 4:30 PM',
          'Sat-Sun 9 AM–10 AM (Live games / scrimmages)'
        ],
        price: { monthly: '$100', weekly: '$50', dropin: '$15' },
        earlyBird: { price: '', deadline: '' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      },
      {
        id: 'bb-junior-academy-bds',
        interest: 'Basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Junior Academy',
        imageUrl: 'assets/img/pages/home/deacons-basketball-camp-basketball.png',
        imageAlt: 'Deacons Basketball Junior Academy Program',
        dates: { start: '', end: '' },
        venue: 'The Hardcourts at Deacons',
        ages: 'Boys & Girls 12–15',
        schedule: [
          'Mon-Fri 4:30 PM–6:00 PM',
          'Sat-Sun 10 AM–11 AM (Live games / scrimmages)'
        ],
        price: { monthly: '$200', weekly: '$75', dropin: '$20' },
        earlyBird: { price: '', deadline: '' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      },
      {
        id: 'bb-u16-elite-bds',
        interest: 'Basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Elite Academy',
        imageUrl: 'assets/img/pages/home/deacons-basketball-camp-basketball.png',
        imageAlt: 'Deacons Basketball Elite Academy Program',
        dates: { start: '', end: '' },
        venue: 'The Hardcourts at Deacons',
        ages: 'Boys & Girls 16–19',
        schedule: [
          'Mon-Fri 6:00 PM–7:30 PM',
          'Sat-Sun 5 PM–7 PM (Live games / scrimmages)'
        ],
        price: { monthly: '$200', weekly: '$75', dropin: '$20' },
        earlyBird: { price: '', deadline: '' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      }/*,
      {
        id: 'bb-girls-programme-bds',
        interest: 'Basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Girls Academy',
        imageUrl: 'assets/img/pages/home/deacons-basketball-camp-basketball.png',
        imageAlt: 'Deacons Basketball Girls Academy Program',
        dates: { start: '', end: '' },
        venue: 'The Hardcourts at Deacons',
        ages: 'All ages',
        schedule: [
          'Mon-Fri 4:30 PM–5:30 PM',
          'Sat 10 AM–11 AM (Live games / scrimmages)'
        ],
        price: { monthly: '$200', weekly: '$75', dropin: '$20' },
        earlyBird: { price: '', deadline: '' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },*/
    ]
  };

  /** Load camps with static-first strategy. Optional country filter. */
  getActivities$(interestIn: string, countryIn?: string, activeOnly: boolean = true): Observable<Activity[]> {
    // 1) Normalize sport key so it matches your staticCamps keys.
    // From interestIn or query param
    const key = toActivityKey(interestIn) ?? 'basketball'; // fallback you prefer

    // 2) Safe fallback lookup.
    const allFallback = this.Activities[key] ?? []; // fully type-safe
    //allFallback = allFallback[interest] ?? [];

    // 3) Robust diacritic-insensitive "contains" (no \p{Diacritic}).
    const norm = (s: string = '') =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const contains = (hay: string, needle: string) => norm(hay).includes(norm(needle));
  
    // 4) Apply contains filter only if a filter is provided.
    let fallback = countryIn
      ? allFallback.filter(c =>
          contains(c.cityAndCountry ?? `${c.venue}, ${c.country ?? ''}`, countryIn)
        )
      : allFallback;

    if (activeOnly) 
      fallback = fallback.filter(c => contains(c.status, 'open'));

    // 5) Build params for API (if you have one).
    let params = new HttpParams().set('interest', interestIn);
    if (countryIn) params = params.set('cityAndCountry', countryIn);
    
    // 6) Call API, but always emit fallback immediately via startWith.
    const api$ = this.http.get<Activity[]>(`${this.baseUrl}/activities`, { params }).pipe(
      catchError((err) => {
        console.warn('[ActivityService] API error, using fallback', err);
        return of<Activity[]>([]);
      }),
      map(api => (Array.isArray(api) && api.length ? api : fallback))
    );
  
    return api$.pipe(
      map(list =>
        (list.length ? list : fallback)
          .map(c => ({ ...c, status: autoStatus(c) })) // optional
          .sort((a, b) => +new Date(a.dates.start) - +new Date(b.dates.start))
      ),
      startWith(fallback),
      shareReplay(1)
    );

    function autoStatus(c: Activity, now = new Date()): ActivityStatus {
      // Respect explicit status if manually set
      if (c.status && ['open', 'coming_soon', 'closed'].includes(c.status))
        return c.status;
    
      const start = new Date(c.dates.start);
      const end = new Date(c.dates.end);
      const today = now;
      const registrationOpenDaysBefore = 45;
    
      const openFrom = new Date(start);
      openFrom.setDate(start.getDate() - registrationOpenDaysBefore);
    
      if (today > end) return 'closed';
      if (today < openFrom) return 'coming_soon';
      return 'open';
    }
        
  }

}

export function toActivityKey(input: unknown): ActivityKey | null {
  const norm = String(input ?? '')
    .toLowerCase()
    .replace(/[-_\s]/g, '') // drop '-', '_' and spaces
    .trim();

  switch (norm) {
    case 'basketball':  return 'basketball';
    default:            return null;
  }
}
