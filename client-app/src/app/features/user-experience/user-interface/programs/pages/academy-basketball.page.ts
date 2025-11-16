import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterComponent } from '../../correspondence/components/newsletter.component';
import { BaseHeroComponent } from "../../../~common/components/base-hero/base-hero.component";
import { CardsComponent } from "../../../~common/components/cards/cards.component";

@Component({
  selector: 'app-academy-basketball',
  standalone: true,
  imports: [CommonModule, RouterLink, NewsletterComponent, BaseHeroComponent, CardsComponent],
  templateUrl: './academy-basketball.page.html',
  styleUrls: ['./academy-basketball.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AcademyBasketballPage extends BasePageComponent {
    @Input({ required: true }) activityType:  string = 'Basketball-Academy';
  
  override pageName = 'vsa-page';
  description = `
  Deacons Basketball Academies deliver high-intensity basketball training focused on skill mastery, game IQ development, 
  and leadership growth. Our academies grow from fundemental drills -> advanced drills with competitive games, helping players gain confidence, improve performance, and prepare for the next level of play.
  `.trim();
  

  highlights = [
    'Advanced basketball skills labs + position-specific coaching',
    'IQ & film breakdowns, leadership & conflict resolution',
    'Speed, agility, and fitness testing with benchmarks',
    'Scrimmage, games and exposure tours'
  ];

  // You can override lifecycle hooks if you need extra logic
  override ngOnInit(): void {
    super.ngOnInit();
    // Any basketball-specific setup here (e.g. analytics event)
  }
}

