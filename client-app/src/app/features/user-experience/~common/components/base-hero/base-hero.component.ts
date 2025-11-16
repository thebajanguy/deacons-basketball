import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, Inject, Renderer2, RendererFactory2, OnChanges } from '@angular/core';
import { NgIf, NgFor, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SocialPluginComponent } from "../social-plugin/social-plugin.component";
import { FixedSocialPluginComponent } from "../fixed-social-plugin/fixed-social-plugin.component";

export type HeroCta = {
  label: string;
  routerLink?: any[] | string;
  href?: string;
  ariaLabel?: string;
  fragment?:string;
  rel?: string;
  target?: '_blank' | '_self';
  variant?: 'primary' | 'outline' | 'ghost' | 'light';
};

@Component({
  selector: 'app-base-hero-cmp',
  standalone: true,
  imports: [CommonModule , NgIf, NgFor, RouterLink, SocialPluginComponent, FixedSocialPluginComponent],
  templateUrl: './base-hero.component.html',
  styleUrls: ['./base-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseHeroComponent extends BasePageComponent implements OnChanges {
  override pageName = 'global-page';
  /** Required */
  @Input() title = '';
  /** Optional subheading */
  @Input() subtitle:string = '';
  /** Optional description */
  @Input() description = '';
  @Input() breadcrumbSEO = 'Deacons Basketball Club';
  @Input() isNavigationPage = true;


  /** Optional background image (will render as CSS background for performance) */
  @Input() backgroundUrl?: string;
  /** Decorative overlay: 'none' | 'dark' | 'gold' */
  @Input() overlay: 'none' | 'dark' | 'gold' = 'dark';
  /** Max content width */
  @Input() maxWidth = '920px';
  /** Optional breadcrumb trail */
  @Input() breadcrumb?: { label: string; link?: any[] | string }[];
  /** Call-to-action buttons */
  @Input() ctas: HeroCta[] = [];

  /** Accessibility: background image alt (if you also include an <img>, which we don't by default) */
  @Input() bgAlt = 'Decorative program background';
  @Input() headerSize: 'xs' | 'sm' | 'md' | 'lg' | 'none' | '' | null | undefined = 'none';

  safeTitle: SafeHtml = '';
  safeSubtitle: SafeHtml = '';
  safeDescription: SafeHtml = '';


  get headerClasses() {
    const size = (this.headerSize ?? '').toString().trim();
    return {
      'page-header-xs': size === 'xs',
      'page-header-sm': size === 'sm',
      'page-header-lg': size === 'lg',
      'page-header-xl': size === 'none' || size === 'xl', // collapse spacing
      // note: 'md' or ''/null => no extra size class; default styles apply
    };
  }
  constructor( 
    @Inject(DOCUMENT) doc: Document, rf: RendererFactory2) {
    super(doc, rf);
  } 

  ngOnChanges(): void {
    // sanitize description to allow HTML formatting like <em>, <strong>, etc.
    this.safeTitle = this.sanitizer.bypassSecurityTrustHtml(this.title);
    this.safeSubtitle = this.sanitizer.bypassSecurityTrustHtml(this.subtitle);
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.description);
  }

}
