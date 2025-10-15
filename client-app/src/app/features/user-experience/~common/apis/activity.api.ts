

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, startWith, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export type ActivityStatus = 'open' | 'coming_soon' | 'closed';
export interface Activity {
  id: string;
  country?: string,
  cityAndCountry?:string;          // country where camp is being held ... Barbados | United States | Trinidad | Abu Dabi
  sport: 'basketball' | 'soccer'  | 'multi' | 'other';
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


@Injectable({ providedIn: 'root' })
export class ActivityApi {
  private http = inject(HttpClient);
  private baseUrl = '/api'; // change if needed

  // --- Static fallback data (edit to your needs) ---
  private staticCamps: Record<string, Activity[]> = {
    afterschool: [
      {
        id: 'as-fall-2025-bds',
        sport: 'basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'After-school Term-One',
        imageUrl: 'assets/img/pages/what-we-do/vsaprep-what-we-do-ncaa-eligibility-support.png',
        imageAlt: 'Brains & Ballers Fall After-school Program',
        dates: { start: '2025-09-08', end: '2025-12-12' },
        venue: 'The Deacons Resource Center',
        ages: '11–18',
        schedule: [
          'Mon–Fri 3:30–5:30 PM • Study Hall • Tutoring • Study Skills',
          'Mon–Fri 5:30–7:30 PM • Sports Lab • Film Study • Games'
        ],
        price: { monthly: '$400', weekly: '$125', dropin: '$50' },
        earlyBird: { price: null, deadline: null },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      }
    ],
    basketball: [
      {
        id: 'bb-fall-2025-bds',
        sport: 'basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Fall Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-basketball.png',
        imageAlt: 'Brains & Ballers Fall Basketball Camp',
        dates: { start: '2025-10-22', end: '2025-10-26' },
        venue: 'The St. Michael School',
        ages: '11–18',
        schedule: [
          'Thu–Sat 8 AM–5 PM',
          'Sun 9 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$200', dropin: '$50' },
        earlyBird: { price: '$100', deadline: '2025-10-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      },
      {
        id: 'bb-winter-2025-bds',
        sport: 'basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Winter Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-basketball.png',
        imageAlt: 'Brains & Ballers Winter Basketball Camp',
        dates: { start: '2025-12-15', end: '2025-12-19' },
        venue: 'The St. Michael School',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-11-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
      {
        id: 'bb-spring-2025-bds',
        sport: 'basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Spring Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-basketball.png',
        imageAlt: 'Brains & Ballers Winter Basketball Camp',
        dates: { start: '2026-04-06', end: '2026-04-17' },
        venue: 'The St. Michael School',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-03-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
      {
        id: 'bb-summer-2025-bds',
        sport: 'basketball',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Summer Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-basketball.png',
        imageAlt: 'Brains & Ballers Winter Basketball Camp',
        dates: { start: '2026-10-21', end: '2026-10-21' },
        venue: 'The St. Michael School',
        ages: '11–18',
        schedule: [
          'Thu–Sat 8 AM–5 PM',
          'Sun 9 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-07-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
    ],
    soccer: [
      {
        id: 'sc-fall-2025-bds',
        sport: 'soccer',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Fall Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-soccer.png',
        imageAlt: 'Brains & Ballers Fall Soccer Camp',
        dates: { start: '2025-10-22', end: '2025-10-26' },
        venue: 'Deacons Playing Field',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-07-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'open'
      },
      {
        id: 'sc-winter-2025-bds',
        sport: 'soccer',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Winter Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-soccer.png',
        imageAlt: 'Brains & Ballers Winter Soccer Camp',
        dates: { start: '2025-12-15', end: '2025-12-19' },
        venue: 'Deacons Playing Field',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-07-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
      {
        id: 'sc-spring-2025-bds',
        sport: 'soccer',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Spring Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-soccer.png',
        imageAlt: 'Brains & Ballers Winter Soccer Camp',
        dates: { start: '2026-04-06', end: '2026-04-17' },
        venue: 'Deacons Playing Field',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-07-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
      {
        id: 'sc-summer-2025-bds',
        sport: 'soccer',
        country: 'Barbados',
        cityAndCountry: 'Bridgetown, Barbados',
        editionLabel: 'Summer Edition 2025',
        imageUrl: 'assets/img/pages/home/vsaprep-camp-soccer.png',
        imageAlt: 'Brains & Ballers Winter Soccer Camp',
        dates: { start: '2026-10-21', end: '2026-10-21' },
        venue: 'Deacons Playing Field',
        ages: '11–18',
        schedule: [
          'Mon-Thu 8 AM–5 PM',
          'Fri 8 AM–5 PM (Live games / scrimmages)'
        ],
        price: { monthly: null, weekly: '$250', dropin: '$75' },
        earlyBird: { price: '$150', deadline: '2025-07-15' },
        paymentMethods: ['1st Pay', 'Cash', 'Online'],
        status: 'coming_soon'
      },
    ]
  };

  /** Load camps with static-first strategy. Optional country filter. */
  getCamps$(sportIn: string, countryIn?: string, activeOnly: boolean = true): Observable<Activity[]> {
    // 1) Normalize sport key so it matches your staticCamps keys.
    const sport = (sportIn || '').toLowerCase().trim() as keyof typeof this.staticCamps;
  
    // 2) Safe fallback lookup.
    const allFallback = this.staticCamps[sport] ?? [];
    //allFallback = allFallback[sport] ?? [];

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
    let params = new HttpParams().set('sport', sport);
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
