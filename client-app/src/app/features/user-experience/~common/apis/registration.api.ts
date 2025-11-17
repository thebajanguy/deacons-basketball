// src/app/services/information.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { REGISTRATION_API_BASE_URL } from '../../../../core/tokens/api-config-url.tokens';

// A strongly-typed union you can extend as needed
export const INTEREST_OPTIONS = ['Basketball'] as const;
export type InterestOption = typeof INTEREST_OPTIONS[number];

export const COUNTRY_OPTIONS  = ['Barbados'] as const;
export type CountryOption  = typeof COUNTRY_OPTIONS[number];

export const SKILL_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export type SkillLevelOption = typeof SKILL_LEVEL_OPTIONS[number];

export const BASKETBALL_POSITION_OPTIONS = ['Guard', 'Forward', 'Center', 'Not Sure'] as const;
export type BasketballPositionOption = typeof BASKETBALL_POSITION_OPTIONS[number]; 

export const SOCCER_POSITION_OPTIONS = ['GoalKeeper', 'Defender', 'Midfielder', 'Forward'] as const;
export type SoccerPositionOption = typeof SOCCER_POSITION_OPTIONS[number]; 

export const TSHIRT_SIZE_OPTIONS = ['YS', 'YM', 'YL', 'YXL', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type TShirtSizeOption = typeof TSHIRT_SIZE_OPTIONS[number]; 

export const GUARDIAN_RELATION_OPTIONS = ['Mother', 'Father', 'Aunt', 'Uncle', 'Grand Mother', 'Grand Father', 'Guardian', 'Other'] as const;
export type GuardianRelationOption = typeof GUARDIAN_RELATION_OPTIONS[number]; 

export const PAYMENT_METHOD_OPTIONS = ['Stripe', 'Cash', 'FirstPay', 'BankTransfer'] as const;
export type PaymentMethodOption = typeof PAYMENT_METHOD_OPTIONS[number]; 

export const PAYMENT_STATUS_OPTIONS = ['Pending', 'Completed', 'Failed'] as const;
export type PaymentStatusOption = typeof PAYMENT_STATUS_OPTIONS[number]; 


export interface ActivityRegistrationDto{
  RegistrationType?: string | null; // After-School / Basketball-Camp / Soccer-Camp 
  ApplicationName?: string | null;

  Country?: string | null;  // Barbados / United States / etc. Used to look up camp or activity.
  Interest?: string | null; // Basketball / Soccer / After-School / etc. Used to look up camp or activity

  ActivityId?: string | null;// campId or afterSchoolId

  Player?: {
    Givenname?: string | null;
    Surname?: string | null;
    DOB?: string | null;// 'YYYY-MM-DD' preferred

    Email?: string | null;
    Phone?: string | null;

    School?: string | null;
    GradeOrForm?: string | null;
    Position?: string | null;
    SkillLevel?: string | null;
    TshirtSize?: string | null;
  }
  

  Guardian?:{
    GuardianName?: string | null;
    GuardianEmail?: string | null;
    GuardianPhone?: string | null;
    GuardianRelation?: string | null;
  }

  Payment?: {
    PaymentMethod?: string | null;
    PaymentAmount?: number | null;
    PaymentCurrency?: string | null;
    PaymentStatus?: string | null;
    PaymentTransactionId?: string | null;
  }

  Notes?: string | null;
  CreatedAt?: string | null;
  Honeypot?: string; // anti-bot hidden input
};


@Injectable({ providedIn: 'root' })
export class ActivityRegistrationApi {  
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(REGISTRATION_API_BASE_URL);

  // Raw client bypasses ALL interceptors (handy to isolate issues)
  private rawHttp = new HttpClient(inject(HttpBackend));

  registerForCamp(payload: any): Observable<string> {
    const url = `${this.apiBaseUrl}/registrations/gold-camp`;
    console.log('POST', url, payload);

    // Use rawHttp first. If this works, your interceptor is the culprit.
    return this.rawHttp.post<string>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // Your function may return empty body; treat as text to avoid JSON parse errors
      responseType: 'text' as 'json'
    });

  }
  registerForAfterschool(payload: any): Observable<string> {
    const url = `${this.apiBaseUrl}/registrations/after-school`;
    console.log('POST', url, payload);

    // Use rawHttp first. If this works, your interceptor is the culprit.
    return this.rawHttp.post<string>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // Your function may return empty body; treat as text to avoid JSON parse errors
      responseType: 'text' as 'json'
    });

  }
    
}

