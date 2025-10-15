import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SocialPluginComponent } from "../../~common/components/social-plugin/social-plugin.component";
import { NewsletterPage } from "../../correspondence/pages/newsletter.page";
import { FixedSocialPluginComponent } from "../../~common/components/fixed-social-plugin/fixed-social-plugin.component"; 
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";

@Component({
    selector: 'app-who-we-are',
    standalone: true,

    imports: [CommonModule, RouterLink, SocialPluginComponent, NewsletterPage, FixedSocialPluginComponent, BaseHeroComponent],
    templateUrl: './who-we-are.page.html',
    styleUrl: './who-we-are.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhoWeArePage extends BasePageComponent {
    override pageName = 'vsa-page';
}