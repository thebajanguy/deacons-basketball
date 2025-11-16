import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterComponent } from '../../correspondence/components/newsletter.component';
import { BaseHeroComponent } from "../../../~common/components/base-hero/base-hero.component";

@Component({ 
  selector: 'app-programs-landing',
  standalone: true,

  imports: [CommonModule, RouterLink, NewsletterComponent, BaseHeroComponent],
  templateUrl: './programs-landing.page.html',
  styleUrl: './programs-landing.page.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramsLandingPage extends BasePageComponent implements OnInit {
  override pageName = 'vsa-page';
  description = `
  Academic tutoring, sports performance, and recruiting support—built for Barbadian young-basketballers.
  `.trim();

  
}

