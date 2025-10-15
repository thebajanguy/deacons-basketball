/////
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  withFetch,
} from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
//
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
// BEGIN: MSAL AND B2C CONFIGURATION
// END: MSAL AND B2C CONFIGURATION

import { environment } from '../../environments/environment';
import { ROUTER_PROVIDERS } from './app.routes';

import { IdentityManagementModule } from '../features/identity-management/~identity-management.module';
import { CoreApplicationModule } from '../core/~core.module';
import { RouteSeoService } from '../core/services/route-seo.service';
import { CORRESPONDENCE_API_BASE_URL, REGISTRATION_API_BASE_URL, SITE_URL } from '../core/tokens/api-config-url.tokens';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    ROUTER_PROVIDERS,
    importProvidersFrom(
      BrowserModule,
      MatButtonModule,
      MatToolbarModule,
      MatListModule,
      MatMenuModule,
      
      CoreApplicationModule,
      IdentityManagementModule
    ),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideAnimations(),
    { provide: REGISTRATION_API_BASE_URL, useValue: environment.registrationApiBaseUrl },
    { provide: CORRESPONDENCE_API_BASE_URL, useValue: environment.correspondenceApiBaseUrl },
    { provide: SITE_URL, useValue: environment.appSettings.siteUrl },
    { provide: RouteSeoService, useClass: RouteSeoService }

  ],
};