import { Routes } from '@angular/router';
import { seoResolve } from '../../../../core/resolvers/seo.resolver';

export const CORRESPONDENCE_ROUTES: Routes = [
  { // Consultation
      path: 'attend-a-practice',
      loadComponent: () =>
        import('./pages/consultation.page').then(m => m.ConsultationPage),
          resolve: { seo: seoResolve({
            title: 'Attend a Practice | Deacons Basketball Club | Academic & Athletic Training Support | Request a Meeting',
            description: 'Attend a practice with Deacons Basketball Club. Discuss academics, training, scholarships, and next steps for your student-athlete.',
            canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/attend-a-practice',
            keywords: 'Deacons Basketball Club, Basketball Barbados, Youth Basketball Barbados, Basketball Training Barbados, Basketball Camps Barbados, Deacons Hardcourt, Barbados Basketball Association, Barbados Youth Sports, Barbados U14 U16 U19 Basketball, Basketball Development Barbados, Student Athletes Barbados, Barbados Sports Academy, Basketball Teams in Barbados, Basketball Practice Barbados, Barbados Basketball Club',
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
          }            })}
  },
  { // Contact
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact.page').then(m => m.ContactPage),
        resolve: { seo: seoResolve({
          title: 'Contact Deacons Basketball Club | Academic & Athletic Training Support',
          description: 'Get in touch with Deacons Basketball Club to learn about academic tutoring, athletic training, scholarships, and group rates. Contact us today to start your student-athlete journey.',
          canonical: 'https://www.deaconsbasketball.com/en/youth-basketball-club/contact',
          keywords: 'Deacons Basketball Club, Basketball Barbados, Youth Basketball Barbados, Basketball Training Barbados, Basketball Camps Barbados, Deacons Hardcourt, Barbados Basketball Association, Barbados Youth Sports, Barbados U14 U16 U19 Basketball, Basketball Development Barbados, Student Athletes Barbados, Barbados Sports Academy, Basketball Teams in Barbados, Basketball Practice Barbados, Barbados Basketball Club',
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