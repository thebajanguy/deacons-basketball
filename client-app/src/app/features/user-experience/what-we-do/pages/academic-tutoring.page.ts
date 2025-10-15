import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { FixedSocialPluginComponent } from "../../~common/components/fixed-social-plugin/fixed-social-plugin.component";
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";

@Component({
    selector: 'app-academic-tutoring',
    standalone: true,

    imports: [CommonModule, RouterLink, NewsletterPage, BaseHeroComponent, FixedSocialPluginComponent],
    templateUrl: './academic-tutoring.page.html',
    styleUrl: './academic-tutoring.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademicTutoringPage  extends BasePageComponent {
  override pageName = 'vsa-page';
  description = `
  One-to-one and small-group tutoring that fits training schedules—so grades rise with performance. Guided by <em>Labor Durus</em> (“Hard Work Always Pays Off”).
  One-to-one and small-group tutoring that fits training schedules—so grades rise with performance. Guided by <em>Labor Durus</em> (“Hard Work Always Pays Off”).
  `;

  highlights = [
    'Curriculum-aligned tutoring (CSEC/CAPE and U.S. standards)',
    'Weekly progress checks and feedback to parents/guardians',
    'Flexible scheduling around practice and competitions',
  ];
}