// app.routes.ts
import { Routes, provideRouter, withInMemoryScrolling, withPreloading, withRouterConfig } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

import { languageCanMatch } from '../core/guards/language.guard';
import { seoResolve } from '../core/resolvers/seo.resolver';

import { UserExperienceLayout } from '../features/user-experience/~layout/user-experience.layout';

export const DEFAULT_LANG = 'en';
export const SUPPORTED_LANGS = ['en', 'es', 'fr'] as const;

const routes: Routes = [
  // Localized shell
  {
    //path: ':lang',
    path: `${DEFAULT_LANG}/academics-and-sports`,
    component: UserExperienceLayout,
    canMatch: [languageCanMatch(SUPPORTED_LANGS, DEFAULT_LANG)],
    children: [
      { // Home
        path: 'student-athletes',
        loadComponent: () =>
          import('../features/user-experience/home/pages/home.page')
          .then(m => m.HomePage),
            resolve: { seo: seoResolve({
              title: 'Home | Varsity Sports Academy | Academic Tutoring & Elite Sports Training for Student-Athletes',
              description: 'Varsity Sports Academy Prep in Barbados combines academic tutoring, basketball, soccer & volleyball training, and NCAA recruiting guidance to help student-athletes earn scholarships.',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/',
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
      { // Who We Are
        path: 'sports-academics-prep',
        loadComponent: () =>
          import('../features/user-experience/who-we-are/pages/who-we-are.page')
          .then(m => m.WhoWeArePage),
            resolve: { seo: seoResolve({
              title: 'Who We Are | Varsity Sports Academy Prep',
              description: 'Learn about our mission: academics + elite sports training + NCAA readiness.',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/who-we-are',
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
      { // Our Approach
        path: 'approach',
        loadComponent: () =>
          import('../features/user-experience/approach/pages/approach.page')
          .then(m => m.ApproachPage),
            resolve: { seo: seoResolve({
              title: 'Our Approach | Varsity Sports Academy Prep — Academic & Athletic Development',
              description: 'Varsity Sports Academy Prep takes a full-cycle approach to youth development—combining academics, athletic training, data analytics, and mentorship to help student-athletes reach their full potential.',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/approach',
              keywords: 'Varsity Sports Academy, student athletes, youth sports training, academic tutoring, sports analytics, athlete development, AI performance tracking, Barbados sports academy',
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

      // What We do / Services
      {  // Academic tutoring
        path: 'academic-tutoring',
        loadComponent: () => import('../features/user-experience/what-we-do/pages/academic-tutoring.page')
          .then(m => m.AcademicTutoringPage),
            resolve: { seo: seoResolve({
              title: 'Academic Tutoring for Student-Athletes | Varsity Sports Academy Prep',
              description: 'One-to-one and group tutoring for student-athletes in core subjects, study skills, and SAT/ACT/CSEC/CAPE test prep. Support for NCAA 16-core eligibility.',
              keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/academic-tutoring',
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
      { // NCAA compliance
        path: 'ncaa-compliance',
        loadComponent: () => import('../features/user-experience/what-we-do/pages/ncaa-compliance.page')
          .then(m => m.NcaaCompliancePage),
            resolve: { seo: seoResolve({
              title: 'NCAA Compliance & Academic Support Guidance | Varsity Sports Academy Prep',
              description: 'Get help with NCAA 16-core course mappings, GPA & sliding scale, amateurism certification, eligibility timelines, transcripts, and recruiting rules for student-athletes.',
              keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/ncaa-compliance',
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
      { // Sports development
        path: 'sports-development',
        loadComponent: () =>
          import('../features/user-experience/what-we-do/pages/sports-development.page')
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
      { // Recruitment & exposure
        path: 'recruitment-exposure',
        loadComponent: () => import('../features/user-experience/what-we-do/pages/recruitment-exposure.page')
          .then(m => m.RecruitmentAndExposurePage),
            resolve: { seo: seoResolve({
              title: 'Athlete Recruitment & Exposure Strategy | Varsity Sports Academy Prep',
              description: 'Get recruited with Varsity Sports Academy Prep’s strategy: athlete profiles, highlights, showcase events, coach outreach, social media best practices, and scholarship negotiation support.',
              keywords: 'high school sports development, youth athlete training, basketball training, soccer training, volleyball training, speed and agility, strength and conditioning, Barbados, NCAA preparation, athletic scholarships',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/recruitment-exposure',
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

      // Programs
      {// Programs page
        path: 'programs',
        loadComponent: () => import('../features/user-experience/programs/pages/programs-landing.page')
          .then(m => m.ProgramsLandingPage),
            resolve: { seo: seoResolve({
              title: 'Brains & Ballers Academics & Sports Programa | Varsity Sports Academy',
              description: 'Join the Brains & Ballers Academics and Sports Program at Varsity Sports Academy Prep for academic support and athletic training.',
              keywords: 'after school programa, aports camps, academic supporta, athletic training, youth sports, Barbados',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/programs/',
              robots: 'index,follow',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Service',
                'name': 'Brains & Ballers Academics and Sports Programs',
                'serviceType': 'Educational Program',
                'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
                'areaServed': 'BB'
              }
          })}
      },
      {// Aftershool
        path: 'after-school',
        loadComponent: () =>
          import('../features/user-experience/programs/pages/after-school.page')
            .then(m => m.AfterSchoolPage),
          resolve: { seo: seoResolve({
            title: 'Brains & Ballers After-School Programs | Varsity Sports Academy Prep',
            description: 'Daily homework support, CSEC/CAPE/SAT prep, and sport-specific training—built for student-athletes to improve grades and performance.',
            keywords: 'after school program, academic support, athletic training, youth sports, Barbados',
            canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/after-school',
            robots: 'index,follow',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'EducationalOccupationalProgram',
              'name': 'Brains & Ballers After-School Programs',
              'provider': { '@type': 'Organization', 'name': 'Varsity Sports Academy Prep' },
              'timeOfDay': 'Afternoon',
              'audience': { '@type': 'EducationalAudience', 'educationalRole': 'Student' },
              'hasCourse': [
                { '@type': 'Course', 'name': 'Homework Support & Study Skills' },
                { '@type': 'Course', 'name': 'CSEC/CAPE & SAT/ACT Prep' },
                { '@type': 'Course', 'name': 'Sports Skills, Speed & Agility' }
              ],
              'areaServed': 'BB'
            }
        })}
      },
      {// Gold Camps - Basketball
        path: 'basketball-gold-camps',
        loadComponent: () => import('../features/user-experience/programs/pages/gold-camps-basketball.page')
          .then(m => m.GoldCampsBasketballPage),
            resolve: { seo: seoResolve({
              title: 'Brains & Ballers Basketball Gold Camps | Varsity Sports Academy Prep',
              description: 'Elite basketball skill, IQ, and leadership camp for student-athletes.',
              keywords: 'after school program, academic support, athletic training, youth sports, Barbados',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/basketball-gold-camps',
              robots: 'index,follow',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Service',
                'name': 'Brains & Ballers Basketball Gold Camps',
                'serviceType': 'Educational Program',
                'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
                'areaServed': 'BB'
              }
          })}
      },
      {// Gold Camps - Soccer
        path: 'soccer-gold-camps',
        loadComponent: () => import('../features/user-experience/programs/pages/gold-camps-soccer.page')
          .then(m => m.GoldCampsSoccerPage),
            resolve: { seo: seoResolve({
              title: 'Brains & Ballers Soccer Gold Camps | Varsity Sports Academy Prep',
              description: 'Advanced soccer training, fitness, and showcase experience for student-athletes.',
              keywords: 'after school program, academic support, athletic training, youth sports, Barbados',
              canonical: 'https://www.varsitysportsacademy.com/n/academics-and-sports/soccer-gold-camps',
              robots: 'index,follow',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Service',
                'name': 'Brains & Ballers Soccer Gold Camps',
                'serviceType': 'Educational Program',
                'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
                'areaServed': 'BB'
              }
          })}
      },
      {// Programs Registration page
        path: 'register',
        loadComponent: () => import('../features/user-experience/programs/pages/programs-register.page')
          .then(m => m.ProgramsRegisterPage),
            resolve: { seo: seoResolve({
              title: 'Brains & Ballers Academics & Sports Programa | Varsity Sports Academy',
              description: 'Join the Brains & Ballers Academics and Sports Program at Varsity Sports Academy Prep for academic support and athletic training.',
              keywords: 'after school programa, aports camps, academic supporta, athletic training, youth sports, Barbados',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/programs/',
              robots: 'index,follow',
              jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Service',
                'name': 'Brains & Ballers Academics and Sports Programs',
                'serviceType': 'Educational Program',
                'provider': { '@type': 'EducationalOrganization', 'name': 'Varsity Sports Academy Prep' },
                'areaServed': 'BB'
              }
          })}
      },

      // Correspondence
      { // Consultation
          path: 'consultation',
          loadComponent: () =>
            import('../features/user-experience/correspondence/pages/consultation.page').then(m => m.ConsultationPage),
              resolve: { seo: seoResolve({
                title: 'Free Consultation | Varsity Sports Academy Prep | Academic & Athletic Training Support | Request a Meeting',
                description: 'Book a free consultation with Varsity Sports Academy Prep. Discuss academics, training, scholarships, and next steps for your student-athlete.',
                canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/consultation',
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
      { // Contact
        path: 'contact',
        loadComponent: () =>
          import('../features/user-experience/correspondence/pages/contact.page').then(m => m.ContactPage),
            resolve: { seo: seoResolve({
              title: 'Contact Varsity Sports Academy Prep | Academic & Athletic Training Support',
              description: 'Get in touch with Varsity Sports Academy Prep to learn about academic tutoring, athletic training, scholarships, and group rates. Contact us today to start your student-athlete journey.',
              canonical: 'https://www.varsitysportsacademy.com/en/academics-and-sports/contact',
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

    ]
  },

  { path: '',   redirectTo: `${DEFAULT_LANG}/academics-and-sports/student-athletes`, pathMatch: 'full', },
  { path: '**', redirectTo: `${DEFAULT_LANG}/academics-and-sports/student-athletes`, pathMatch: 'full', },

];

export const ROUTER_PROVIDERS = [
  provideRouter(routes,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    withRouterConfig({ onSameUrlNavigation: 'reload' }),
    withPreloading(PreloadAllModules) // faster perceived loads
  )
];


