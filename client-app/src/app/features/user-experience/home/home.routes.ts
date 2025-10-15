// what-we-do.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../core/resolvers/seo.resolver';

export const HOME_ROUTES: Routes = [
{
  path: '',
  loadComponent: () =>
      import('./pages/home.page').then(m => m.HomePage),
      resolve: { seo: seoResolve({
          title: 'Home | Varsity Sports Academy | Academic Tutoring & Elite Sports Training for Student-Athletes',
          description: 'Varsity Sports Academy Prep in Barbados combines academic tutoring, basketball, soccer & volleyball training, and NCAA recruiting guidance to help student-athletes earn scholarships.',
          canonical: 'https://www.varsitysportsacademy.com/en/sports-and-academic-prep',
          robots: 'index,follow',
          jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              'name': 'Varsity Sports Academy Prep',
              'url': 'https://www.varsitysportsacademy.com/',
              'address': { '@type': 'PostalAddress', 'addressCountry': 'BB' },
              'sameAs': ['https://www.instagram.com/vsaprep']
          }
      })}
  },
];
