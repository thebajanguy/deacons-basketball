import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { SocialPluginComponent } from '../../~common/components/social-plugin/social-plugin.component';
import { FixedSocialPluginComponent } from "../../~common/components/fixed-social-plugin/fixed-social-plugin.component";
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";


@Component({
  selector: 'app-ncaa-compliance',
  standalone: true,
  imports: [CommonModule, RouterLink, SocialPluginComponent, NewsletterPage, FixedSocialPluginComponent, BaseHeroComponent],
  templateUrl: './ncaa-compliance.page.html',
  styleUrls: ['./ncaa-compliance.page.scss']
})
export class NcaaCompliancePage extends BasePageComponent {
  override pageName = 'vsa-page';

  // JSON-LD for FAQ + Breadcrumb
  schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.yoursite.com/" },
          { "@type": "ListItem", "position": 2, "name": "NCAA Compliance & Eligibility Support", "item": "https://www.yoursite.com/ncaa-compliance" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the NCAA 16 core courses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "4 English, 3 Math (Algebra I or higher), 2 Science (1 lab), 1 additional English/Math/Science, 2 Social Science, 4 additional core (e.g., Foreign Language, Philosophy)."
            }
          },
          {
            "@type": "Question",
            "name": "How does the NCAA sliding scale work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It balances core GPA with standardized test scores. Higher GPA requires a lower test score and vice versa."
            }
          },
          {
            "@type": "Question",
            "name": "What can affect my amateur status?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Accepting pay beyond expenses, signing with agents, or competing with/against professionals can jeopardize eligibility."
            }
          },
          {
            "@type": "Question",
            "name": "Which documents must I send to the NCAA Eligibility Center?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Registration, official transcripts, verified test scores, proof of graduation, and amateurism questionnaires."
            }
          }
        ]
      }
    ]
  };


}
