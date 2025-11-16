import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../../~common/components/base-hero/base-hero.component";
import { RegistrationIntakeComponent  } from '../components/registration-intake/registration-intake.component';
import { NewsletterComponent } from '../../correspondence/components/newsletter.component';
import { FixedSocialPluginComponent } from "../../../~common/components/fixed-social-plugin/fixed-social-plugin.component";


@Component({
  selector: 'app-academy-registration',
  standalone: true,

  imports: [
    CommonModule, RouterLink, RegistrationIntakeComponent, BaseHeroComponent, NewsletterComponent, FixedSocialPluginComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academy-registration.page.html',
  styleUrl: './academy-registration.page.scss',
})
export class AcademyRegistrationPage extends BasePageComponent implements OnInit  {
  override pageName = 'vsa-page';
  description = `
  High-intensity basketball skill training, game IQ development, leadership sessions, and exposure tours—built to move you up a level.
  `.trim();  

  highlights = [
    'Fundamental and Advanced skill labs',
    'IQ & film breakdowns, leadership & conflict resolution',
    'Speed, Strength, Agility & Fitness Development',
    'Position-specific coaching',
    'NCAA Eligibility Guidance (core courses, GPA, SAT/ACT, recruiting rules)',
    'Conflict Resolution & Leadership Workshops',
    'Competitive games + tournaments',
    'Exposure camps + tours'
  ];

  interest: 'Basketball' | 'Soccer' | 'After-School' = 'Basketball';
  activityType: 'Basketball-Camp' | 'Soccer-Camp' | 'After-School-Program' = 'Basketball-Camp';
  country: 'Barbados' | 'United States' = 'Barbados';
  
}


