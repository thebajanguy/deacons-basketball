import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { FixedSocialPluginComponent } from '../../~common/components/fixed-social-plugin/fixed-social-plugin.component';
import { SocialPluginComponent } from '../../~common/components/social-plugin/social-plugin.component';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";

@Component({
  selector: 'app-sports-development',
  standalone: true,
  imports: [CommonModule, RouterLink, SocialPluginComponent, NewsletterPage, FixedSocialPluginComponent, BaseHeroComponent],
  templateUrl: './sports-development.page.html',
  styleUrls: ['./sports-development.page.scss']
})
export class SportsDevelopmentPage extends BasePageComponent {
  override pageName = 'vsa-page';

  schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.varsityacademy.com/" },
          { "@type": "ListItem", "position": 2, "name": "Sports Development", "item": "https://www.varsityacademy.com/en/academics-and-sports/sports-development" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "VSA Prep Sports Development Programs",
        "itemListElement": [
          {
            "@type": "Course",
            "name": "Basketball Development",
            "description": "Ball handling, shooting mechanics, defensive IQ, and team strategy."
          },
          {
            "@type": "Course",
            "name": "Soccer Development",
            "description": "Technical footwork, game intelligence, positional play, conditioning."
          },
          {
            "@type": "Course",
            "name": "Volleyball Development",
            "description": "Serving, setting, blocking, power hitting, court awareness."
          },
          {
            "@type": "Course",
            "name": "Track & Field Training",
            "description": "Sprint mechanics, agility, endurance, explosive strength."
          }
        ]
      }
    ]
  };

 
}
