// src/app/services/information.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CORRESPONDENCE_API_BASE_URL } from '../../../../core/tokens/api-config-url.tokens';

// A strongly-typed union you can extend as needed
export const INTEREST_OPTIONS = ['Academics', 'Athletics', 'Sports Program', 'Camps', 'Scholarships', 'Coaching', 'Sponsorship', 'Volunteer', 'Media', 'Other'] as const;
export const COUNTRY_OPTIONS  = ['Barbados','United States','Other'] as const;

export type CountryOption  = typeof COUNTRY_OPTIONS[number];
export type InterestOption = typeof INTEREST_OPTIONS[number];

export interface CorrespondenceDto{
  CorrespondenceType?: string | null;
  ApplicationName?: string | null;
  Fullname?: string | null;
  GivenName?: string | null;
  Surname?: string | null;
  Email?: string | null;
  Phone?: string | null;
  Country?: string | null;
  Interest?: string | null;
  Message?: string | null;
  Day?: string | null;
  Time?: string | null;
  Year?: string | null;
  Honeypot?: string | null; // anti-bot hidden input
};


@Injectable({ providedIn: 'root' })
export class CorrespondenceApi {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(CORRESPONDENCE_API_BASE_URL);

  // Raw client bypasses ALL interceptors (handy to isolate issues)
  private rawHttp = new HttpClient(inject(HttpBackend));

  createConsultation(payload: any): Observable<string> {
    const url = `${this.apiBaseUrl}/correspondences/consultation`;
    console.log('POST', url, payload);

    // Use rawHttp first. If this works, your interceptor is the culprit.
    return this.rawHttp.post<string>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // Your function may return empty body; treat as text to avoid JSON parse errors
      responseType: 'text' as 'json'
    });

  }
  createContact(payload: any): Observable<string> {
    const url = `${this.apiBaseUrl}/correspondences/contact`;
    console.log('POST', url, payload);

    // Use rawHttp first. If this works, your interceptor is the culprit.
    return this.rawHttp.post<string>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // Your function may return empty body; treat as text to avoid JSON parse errors
      responseType: 'text' as 'json'
    });

  }
  createNewsletter(payload: any): Observable<string> {
    const url = `${this.apiBaseUrl}/correspondences/newsletter`;
    console.log('POST', url, payload);

    // Use rawHttp first. If this works, your interceptor is the culprit.
    return this.rawHttp.post<string>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // Your function may return empty body; treat as text to avoid JSON parse errors
      responseType: 'text' as 'json'
    });

  }

}

