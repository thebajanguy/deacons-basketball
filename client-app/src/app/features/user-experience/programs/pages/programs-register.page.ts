import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SocialPluginComponent } from "../../~common/components/social-plugin/social-plugin.component";
import { CampRegistrationIntakeComponent  } from '../../~common/components/camp-registration-intake/camp-registration-intake.component';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { FixedSocialPluginComponent } from "../../~common/components/fixed-social-plugin/fixed-social-plugin.component";


@Component({
  selector: 'app-programs-register',
  standalone: true,

  imports: [
    CommonModule, RouterLink, SocialPluginComponent, CampRegistrationIntakeComponent, BaseHeroComponent, NewsletterPage, FixedSocialPluginComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './programs-register.page.html',
  styleUrl: './programs-register.page.scss',
})
export class ProgramsRegisterPage extends BasePageComponent implements OnInit  {
  override pageName = 'vsa-page';
  description = `
  Our Brains & Ballers Gold Camps deliver high-intensity basketball training focused on skill mastery, game IQ development, and leadership growth. 
  `.trim();  

  highlights = [
    'Advanced skill labs + position-specific coaching',
    'IQ & film breakdowns, leadership & conflict resolution',
    'Speed, Strength, Agility & Fitness Development',
    'Sport-Specific Position Coaching',
    'NCAA Eligibility Guidance (core courses, GPA, SAT/ACT, recruiting rules)',
    'Conflict Resolution & Leadership Workshops',
    'Final day Live scrimmages and camp tournament'
  ];

  sport: 'Basketball' | 'Soccer' = 'Basketball';
  country: 'Barbados' | 'United States' = 'Barbados';
  
}


