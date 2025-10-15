// what-we-do.routes.ts (standalone routing)
import { Routes } from '@angular/router';
import { seoResolve } from '../../../core/resolvers/seo.resolver';


export const WHAT_WE_DO_ROUTES: Routes = [
  { // Academics
    path: 'academic-tutoring',
    loadComponent: () => import('./pages/academic-tutoring.page')
      .then(m => m.AcademicTutoringPage),
    resolve: { seo: seoResolve({
      title: 'Academic Tutoring for Student-Athletes | Varsity Sports Academy Prep',
      description: 'One-to-one and group tutoring for student-athletes in core subjects, study skills, and SAT/ACT/CSEC/CAPE test prep. Support for NCAA 16-core eligibility.',
      keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
      canonical: 'https://www.varsitysportsacademy.com/en/what-we-do/academic-tutoring',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Academic Tutoring for Student-Athletes',
        'serviceType': 'Education Tutoring',
        'areaServed': 'BB',
        'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' }
      }
    }) }
  },
  {
    path: 'ncaa-compliance',
    loadComponent: () => import('./pages/ncaa-compliance.page')
      .then(m => m.NcaaCompliancePage),
    resolve: { seo: seoResolve({
      title: 'NCAA Compliance & Academic Support Guidance | Varsity Sports Academy Prep',
      description: 'Get help with NCAA 16-core course mappings, GPA & sliding scale, amateurism certification, eligibility timelines, transcripts, and recruiting rules for student-athletes.',
      keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
      canonical: 'https://www.varsitysportsacademy.com/en/what-we-do/ncaa-compliance',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'NCAA Compliance Guidance',
        'serviceType': 'Eligibility Advisory',
        'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
        'areaServed': 'BB'
      }
    })}
  },
  { // Sports
    path: 'sports-development',
    loadComponent: () =>
      import('./pages/sports-development.page')
        .then(m => m.SportsDevelopmentPage),
    resolve: { seo: seoResolve({
      title: 'Sports Development | Varsity Sports Academy Prep',
      description: 'Skill development, speed & agility, strength & conditioning, and injury prevention for student-athletes.',
      keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
      canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/sports-development',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Sports Development & Performance Training',
        'serviceType': 'Athletic Training',
        'areaServed': 'BB',
        'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' }
      }
    }) }
  },
  {
    path: 'recruitment-exposure',
    loadComponent: () => import('./pages/recruitment-exposure.page')
      .then(m => m.RecruitmentAndExposurePage),
    resolve: { seo: seoResolve({
      title: 'Athlete Recruitment & Exposure Strategy | Varsity Sports Academy Prep',
      description: 'Get recruited with Varsity Sports Academy Prep’s strategy: athlete profiles, highlights, showcase events, coach outreach, social media best practices, and scholarship negotiation support.',
      keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
      canonical: 'https://www.varsitysportsacademy.com/en/what-we-do/recruitment-exposure',
      robots: 'index,follow',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Athlete Recruitment & Exposure',
        'serviceType': 'Recruiting Advisory',
        'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
        'areaServed': 'BB'
      }
    })}
  },
  {
    path: 'approach',
    loadComponent: () => import('./approach/approach.page').then(m => m.ApproachPage),
    resolve: { seo: seoResolve({
      title: 'Our Approach to Academics & Athletics | Varsity Sports Academy Prep',
      description: 'A proven pathway that blends tutoring, elite training, and character to unlock scholarships.',
      keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
      canonical: 'https://www.varsitysportsacademy.com/en/what-we-do/approach',
      robots: 'index,follow',
      jsonLd: {
    '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Our Approach'
      }
    })}
  },

  // Redirects to normalize legacy paths
  { path: 'en/whatwedo/:slug', redirectTo: 'en/what-we-do/:slug', pathMatch: 'full' }
];
