import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";
import { CampCardsComponent } from "../../~common/components/camp-cards/camp-cards.component";

@Component({
  selector: 'app-gold-camps-soccer',
  standalone: true,

  imports: [CommonModule, RouterLink, NewsletterPage, BaseHeroComponent, CampCardsComponent],
  templateUrl: './gold-camps-soccer.page.html',
  styleUrl: './gold-camps-soccer.page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class GoldCampsSoccerPage extends BasePageComponent {
  override pageName = 'vsa-page';

  description = `
  Our Brains & Ballers Gold Camps deliver high-intensity soccer training focused on skill mastery, 
  game IQ development, and leadership growth. Each camp combines Elite soccer drills with competitive 
  showcase games, helping student-athletes gain confidence, improve performance, and prepare for 
  the next level of play.
  `.trim();

  highlights = [
    'Advanced skill labs + position-specific coaching',
    'IQ & film breakdowns, leadership & conflict resolution',
    'Speed, agility, and fitness testing with benchmarks',
    'Final scrimmage showcase for exposure'
  ];

  override ngOnInit(): void {
    super.ngOnInit();
    // e.g. dynamically fetch soccer-specific data or assets
  }
}
