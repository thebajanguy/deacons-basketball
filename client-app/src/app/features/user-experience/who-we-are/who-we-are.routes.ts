// what-we-do.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../core/resolvers/seo.resolver';

export const WHO_WE_ARE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/who-we-are.page').then(m => m.WhoWeArePage),
        resolve: { seo: seoResolve({
          title: 'Who We Are | Varsity Sports Academy Prep',
          description: 'Learn about our mission: academics + elite sports training + NCAA readiness.',
          canonical: 'https://www.varsitysportsacademy.com/en/about',
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
  }
];

