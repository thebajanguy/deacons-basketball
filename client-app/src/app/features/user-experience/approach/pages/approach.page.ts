import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";


@Component({
    selector: 'app-approach',
    standalone: true,

    imports: [CommonModule, RouterLink, NewsletterPage, BaseHeroComponent],
    templateUrl: './approach.page.html',
    styleUrl: './approach.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ApproachPage extends BasePageComponent {
    override pageName = 'vsa-page';

    description = `
    At <strong>Varsity Sports Academy Prep</strong>, we believe academic excellence and athletic performance go hand in hand. 
    Our full-cycle development model blends classroom tutoring, sport-specific coaching, and data-driven analytics 
    to help student-athletes reach their <strong>true potential</strong>—in school, in sport, and in life.  
    From <strong>strength and speed training</strong> to <strong>AI-powered performance tracking</strong>, 
    every program is designed to build smarter, faster, more resilient athletes.
    `.trim();
}