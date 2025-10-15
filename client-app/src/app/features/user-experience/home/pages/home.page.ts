import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";
import { TimerModalComponent } from "../../~common/components/timer-modal/timer-modal.component";


@Component({
    selector: 'app-home-page',
    standalone: true,

    imports: [CommonModule, RouterLink, NewsletterPage, NgbModule, BaseHeroComponent, TimerModalComponent],
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
  
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage extends BasePageComponent {
    override pageName = 'vsa-page';
    description = `
        You have a dream — we have the game plan. At
        <strong>Varsity Sports Academy Prep</strong>, our motto
        <em>“Labor Durus”</em> (Hard Work Always Pays Off) guides student-athletes
        to succeed in academics and athletics. What you put into life is what
        you’ll get out — train harder, play better, achieve more.
        `.trim();

    // Needed for Welcome Modal
    onModalClosed(reason: 'x'|'overlay'|'dismiss'|'dont-show'|'primary') {
        console.log('modal closed:', reason);
    }
        

    // override enableNavbarTransparent = false;     // uncomment if this page should NOT make navbar transparent
}


