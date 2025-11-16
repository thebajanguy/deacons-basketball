// what-we-do.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../../core/resolvers/seo.resolver';

export const WHO_WE_ARE_ROUTES: Routes = [
  { // Who We Are
    path: 'deacons',
    loadComponent: () =>
      import('./pages/who-we-are.page')
      .then(m => m.WhoWeArePage),
        resolve: { seo: 
          seoResolve({
          title: 'Who We Are | Deacons Basketball Club — Barbados’ Premier Youth Basketball & Development Program',
          description:
            'Barbados youth basketball club developing young ballers through fundamentals, discipline, academics, and NCAA readiness. 2024 U14 & 2025 U16 BABA champions.',
          canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/deacons/',
          robots: 'index,follow',
          keywords:
            'Deacons Basketball Club, youth basketball barbados, basketball camps Barbados, Deacons Hardcourt, basketball academy barbados, student basketballers Barbados, sports development barbados, basketball training Barbados, grassroots basketball, elite basketball program, youth sports, U14 U16 Barbados basketball, barbados basketball club, Barbados Basketball Association',
          openGraph: {
            title: 'Who We Are | Deacons Basketball Club — Barbados’ Premier Youth Basketball & Development Program',
            description:
            'Barbados youth basketball club developing young ballers through fundamentals, discipline, academics, and NCAA readiness. 2024 U14 & 2025 U16 BABA champions.',
            url: 'https://www.deaconsbasketball.com/en/youth-basketball-club/deacons/',
            type: 'website',
            image: 'https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg',
            locale: 'en_BB'
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Who We Are | Deacons Basketball Club Barbados',
            description:
              'Barbados youth basketball club developing young ballers through fundamentals, discipline, academics, and NCAA readiness. 2024 U14 & 2025 U16 BABA champions.',
              image: 'https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg',
            },
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            "@id": "https://www.deaconsbasketball.com/#org",
            "name": "Deacons Basketball Club",
            "slogan": "Build Skills. Grow Character. Win Together.",
            "sport": "Basketball",
            "url": "https://www.deaconsbasketball.com/",
            "logo": "https://www.deaconsbasketball.com/assets/img/logos/internal/icon.png",
            "image": [
              "https://www.deaconsbasketball.com/assets/img/social/deacons-hero.jpg"
            ],
            "foundingDate": "1981",
            "foundingLocation": {
              "@type": "Place",
              "name": "St. Michael, Barbados"
            },
            "areaServed": { "@type": "Country", "name": "Barbados" },
            "memberOf": {
              "@type": "SportsOrganization",
              "name": "Barbados Amateur Basketball Association"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Deacons Hardcourt",
              "addressLocality": "St. Michael",
              "addressCountry": "BB"
            },
            "contactPoint": [{
              "@type": "ContactPoint",
              "contactType": "general",
              "email": "DeaconsBC@outlook.com",
              "areaServed": "BB"
            }],
            "award": ["2024 U14 BABA Champions", "2025 U16 BABA Champions"],
            "sameAs": [
              "https://instagram.com/DeaconsBasketball",
              "https://facebook.com/DeaconsBasketball"
            ],
            "description":
              "Barbados youth basketball club developing young ballers through fundamentals, discipline, academics, and NCAA readiness. 2024 U14 & 2025 U16 BABA champions."
          }
        })
      }
  }
];

