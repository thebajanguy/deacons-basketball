import { Routes } from '@angular/router';
import { seoResolve } from '../../../../core/resolvers/seo.resolver';

export const PROGRAMS_ROUTES: Routes = [
  {// Programs page
    path: 'programs',
    loadComponent: () => import('./pages/programs-landing.page')
      .then(m => m.ProgramsLandingPage),
        resolve: { seo: seoResolve({
          title: 'Brains & Ballers Academics & Sports Programa | Deacons Basketball Club',
          description: 'Basketball Academy, youth basketball Barbados, kids basketball training, boys and girls, movement and balance drills, fun basketball for beginners, Deacons Basketball Club',
          keywords: 'Rookie Academy, youth basketball Barbados, kids basketball training, boys and girls under 11, movement and balance drills, fun basketball for beginners, Deacons Basketball Club',
          canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/programs/',
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
  },
  {// Academies - Basketball
    path: 'academy',
    loadComponent: () => import('./pages/academy-basketball.page')
      .then(m => m.AcademyBasketballPage),
        resolve: { seo: seoResolve({
          title: 'Basketball Academies | Deacons Basketball Club',
          description: 'Basketball Academy, youth basketball Barbados, kids basketball training, boys and girls, movement and balance drills, fun basketball for beginners, Deacons Basketball Club',
          keywords: 'Rookie Academy, youth basketball Barbados, kids basketball training, boys and girls under 11, movement and balance drills, fun basketball for beginners, Deacons Basketball Club',
          canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/academy',
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