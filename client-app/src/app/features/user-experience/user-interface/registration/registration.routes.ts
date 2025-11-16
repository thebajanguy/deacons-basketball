// registration.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../../core/resolvers/seo.resolver';

export const REGISTRATION_ROUTES: Routes = [
  {// Registration page
    path: 'register',
    loadComponent: () => import('./pages/academy-registration.page')
      .then(m => m.AcademyRegistrationPage),
        resolve: { seo: seoResolve({
          title: ' Deacons Basketball Academy Program | Deacons Basketball Club',
          description: 'Deacons Basketball Club is a youth basketball organization in Barbados, developing young-basketballers through training, teamwork, and competition. 2024 U14 and 2025 U16 BABA Champions.',
          keywords: 'youth basketball club, sports camps, basketball fundamentals, basketball training, youth sports, Barbados',
          canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/academy-registration/',
          robots: 'index,follow',
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            "name": "Deacons Basketball Club",
            "sport": "Basketball",
            "url": "https://deaconsbasketball.com/",
            "logo": "https://deaconsbasketball.com/assets/img/logos/internal/icon.png",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "BB",
              "addressLocality": "St. Michael",
              "streetAddress": "Deacons Hardcourt"
            },
            "foundingDate": "1981",
            "description": "Deacons Basketball Club is a youth basketball organization in Barbados, developing young-basketballers through training, teamwork, and competition. 2024 U14 and 2025 U16 BABA Champions.",
            "award": ["2024 U14 BABA Champions", "2025 U16 BABA Champions"],
            "sameAs": [
              "https://instagram.com/DeaconsBasketball",
              "https://facebook.com/DeaconsBasketball"
            ]
        }
      })}
  }
];