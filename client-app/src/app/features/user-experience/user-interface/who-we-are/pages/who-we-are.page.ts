import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsletterComponent } from "../../correspondence/components/newsletter.component";
import { FixedSocialPluginComponent } from "../../../~common/components/fixed-social-plugin/fixed-social-plugin.component"; 
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../../~common/components/base-hero/base-hero.component";

@Component({
    selector: 'app-who-we-are',
    standalone: true,

    imports: [CommonModule, RouterLink, NewsletterComponent, FixedSocialPluginComponent, BaseHeroComponent],
    templateUrl: './who-we-are.page.html',
    styleUrl: './who-we-are.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhoWeArePage extends BasePageComponent {
    override pageName = 'vsa-page';
    description =`Where passion meets purpose, Deacons BC is dedicated to shaping the next generation of young basketball players in Barbados —
    Rooted in discipline, teamwork, and our motto
    <strong>Labor Durus</strong> (<em>“hard work”</em>), we focus on developing
    not just players, but well-rounded leaders.`;
}