// app.routes.ts
import { Routes, provideRouter, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

import { languageCanMatch } from '../core/guards/language.guard';
import { seoResolve } from '../core/resolvers/seo.resolver';

import { UserExperienceLayout } from  '../features/user-experience/~layout/user-experience.layout';
import { HOME_ROUTES } from           '../features/user-experience/user-interface/home/home.routes';
import { WHO_WE_ARE_ROUTES } from     '../features/user-experience/user-interface/who-we-are/who-we-are.routes';
import { CORRESPONDENCE_ROUTES } from '../features/user-experience/user-interface/correspondence/correspondence.routes';
import { PROGRAMS_ROUTES } from       '../features/user-experience/user-interface/programs/programs.routes';
import { REGISTRATION_ROUTES } from   '../features/user-experience/user-interface/registration/registration.routes';

export const DEFAULT_LANG = 'en';
export const SUPPORTED_LANGS = ['en', 'es', 'fr'] as const;

const routes: Routes = [
  // Localized shell
  {
    path: `${DEFAULT_LANG}/youth-basketball-club`,
    component: UserExperienceLayout,
    canMatch: [languageCanMatch(SUPPORTED_LANGS, DEFAULT_LANG)],
    children: [
      ...HOME_ROUTES,
      ...WHO_WE_ARE_ROUTES,
      ...PROGRAMS_ROUTES, 
      ...REGISTRATION_ROUTES, 
      ...CORRESPONDENCE_ROUTES, 
    ]
  },
  { // Indentity and Management Routes
    path: `${DEFAULT_LANG}/youth-basketball-club`,
    component: UserExperienceLayout,
    canMatch: [languageCanMatch(SUPPORTED_LANGS, DEFAULT_LANG)],
    children: [
      { 
        path: 'membership', loadComponent: () =>
          import('../features/identity-management/signup-signin/signup-signin.page').then(m => m.SignupSigninPage)
      },
      { 
        path: 'login-failed', loadComponent: () =>
          import('../features/identity-management/login-failed/login-failed.page').then(m => m.LoginFailedPage)
      }
    ]
  },
  { // User Workspace Routes
    path: `${DEFAULT_LANG}/user-workspace`,
    component: UserExperienceLayout,
    canMatch: [languageCanMatch(SUPPORTED_LANGS, DEFAULT_LANG)],
    children: [
      { 
        path: 'dashboard', loadComponent: () =>
          import('../features/identity-management/user-profile/user-profile.page').then(m => m.UserProfilePage)
      }
    ]
  },

  { path: '',   redirectTo: `${DEFAULT_LANG}/youth-basketball-club/barbados`, pathMatch: 'full', },
  { path: '**', redirectTo: `${DEFAULT_LANG}/youth-basketball-club/barbados`, pathMatch: 'full', },

];

export const ROUTER_PROVIDERS = [
  provideRouter(routes,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    withRouterConfig({ onSameUrlNavigation: 'reload' }),
    withPreloading(PreloadAllModules) // faster perceived loads
  )
];


