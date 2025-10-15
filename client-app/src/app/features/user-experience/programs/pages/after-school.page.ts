import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { SocialPluginComponent } from '../../~common/components/social-plugin/social-plugin.component';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";

@Component({
  selector: 'app-after-school',
  standalone: true,

  imports: [CommonModule, RouterLink, NewsletterPage, BaseHeroComponent],
  templateUrl: './after-school.page.html',
  styleUrl: './after-school.page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AfterSchoolPage extends BasePageComponent {
  override pageName = 'vsa-page';
  description = `
  Brains & Ballers After-School Program helps student-athletes strengthen academic skills, build athletic fundamentals, and grow confidence on and off the field. Our balanced approach combines academic tutoring, sports training, and personal development to help young athletes reach their full potential.
  Open to boys and girls ages 11–18 — limited spots available, register early!
  `.trim();

  highlights = [
    'Homework support + study skills & time management',
    'CSEC/CAPE and SAT/ACT diagnostics & prep',
    'Sport skills, speed, strength, agility, injury-prevention',
    'Progress check-ins and parent updates every 2 weeks',
    'NCAA 16-core mapping and academic planning'
  ];
 ncaa =[
  'Maps subjects to NCAA 16-core requirements.',
  'Tracks GPA and SAT/ACT sliding-scale targets.',
  'Builds study habits to sustain academic performance.'
 ]
}
