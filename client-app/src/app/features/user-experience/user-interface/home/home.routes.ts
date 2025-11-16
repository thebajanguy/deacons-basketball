// what-we-do.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../../core/resolvers/seo.resolver';

export const HOME_ROUTES: Routes = [
  {
    path: 'barbados',
    loadComponent: () =>
      import('./pages/home.page').then(m => m.HomePage),

    // SEO resolver
    resolve: {
      seo: seoResolve({
        title: 'Home | Deacons Basketball Club | Youth Basketball Barbados',
        description:
          'Join Deacons Basketball Club — Barbados’ Premier Youth Development Program. Where passion meets purpose, we empower young ballers to excel on the court and in the classroom through discipline, teamwork, and opportunity.',
        // Pick one style (with trailing slash recommended) and keep it consistent sitewide
        canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/barbados/',
        // Keep keywords short; Google largely ignores but other engines may not
        keywords:
          'Deacons Basketball Club, youth basketball Barbados, basketball training Barbados, basketball camps Barbados, Deacons Hardcourt, Barbados Basketball Association, student basketballers Barbados, U14 U16 Barbados',

        // NEW: Open Graph (Facebook, LinkedIn, etc.)
        openGraph: {
          title: 'Deacons Basketball Club — Youth Basketball Barbados',
          description:
            'Building skills, character, and community. 2024 U14 & 2025 U16 BABA champions.',
          url: 'https://www.deaconsbasketball.com/en/youth-basketball-club/barbados/',
          type: 'website',
          image: 'https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg',
          locale: 'en_BB',
          siteName: 'Deacons Basketball Club'
        },

        // NEW: Twitter Card
        twitter: {
          card: 'summary_large_image',
          title: 'Deacons Basketball Club — Youth Basketball Barbados',
          description:
            'Join Deacons Basketball Club — Barbados’ Premier Youth Development Program. Where passion meets purpose, we empower young ballers to excel on the court and in the classroom through discipline, teamwork, and opportunity.',
          image: 'https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg',
          site: '@DeaconsBasketball' // if you have it; else omit
        },

        // JSON-LD (can be object or array)
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SportsOrganization',
          '@id': 'https://www.deaconsbasketball.com/#org',
          name: 'Deacons Basketball Club',
          slogan: 'Build Skills. Grow Character. Win Together.',
          sport: 'Basketball',
          url: 'https://www.deaconsbasketball.com/',
          logo: 'https://www.deaconsbasketball.com/assets/img/logos/internal/icon.png',
          image: ['https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg'],
          foundingDate: '1981',
          foundingLocation: { '@type': 'Place', name: 'St. Michael, Barbados' },
          areaServed: { '@type': 'Country', name: 'Barbados' },
          memberOf: { '@type': 'SportsOrganization', name: 'Barbados Amateur Basketball Association' },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Deacons Hardcourt',
            addressLocality: 'St. Michael',
            addressCountry: 'BB'
          },
          contactPoint: [{
            '@type': 'ContactPoint',
            contactType: 'general',
            email: 'DeaconsBC@outlook.com',
            areaServed: 'BB'
          }],
          award: ['2024 U14 BABA Champions', '2025 U16 BABA Champions'],
          sameAs: [
            'https://instagram.com/DeaconsBasketball',
            'https://facebook.com/DeaconsBasketball'
          ],
          description:
            'Join Deacons Basketball Club — Barbados’ Premier Youth Development Program. Where passion meets purpose, we empower young ballers to excel on the court and in the classroom through discipline, teamwork, and opportunity.'
        },

        // Optional: robots (defaults to index,follow in resolver)
        robots: 'index,follow'
      })
    }
  }
];
