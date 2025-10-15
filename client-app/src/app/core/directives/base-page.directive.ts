import { Directive, OnInit, OnDestroy, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Directive() // no selector/template—pure base
export abstract class BasePageComponent implements OnInit, OnDestroy {
  protected utilitiesService = inject(UtilitiesService);
  protected platformId = inject(PLATFORM_ID);

  /** Each page must set this; used to toggle a body class */
  abstract pageName: string;

  /** Optional: toggle navbar transparent */
  protected enableNavbarTransparent = true;
  /** Selector for your main navbar (adjust if needed) */
  protected navbarSelector = 'nav.navbar, nav[role="navigation"]';

  urlPath = '';
  loginPath = '';
  date: Date = new Date();

  private r: Renderer2;
  private navbarEl?: Element;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    rf: RendererFactory2
  ) {
    this.r = rf.createRenderer(null, null);
    this.urlPath = this.utilitiesService.UrlRoutePath;
    this.loginPath = this.utilitiesService.LoginRoutePath;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = this.doc.body;
    if (this.pageName) this.r.addClass(body, this.pageName);

    if (this.enableNavbarTransparent) {
      this.navbarEl = this.doc.querySelector(this.navbarSelector) || undefined;
      if (this.navbarEl) this.r.addClass(this.navbarEl, 'navbar-transparent');
    }
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = this.doc.body;
    if (this.pageName) this.r.removeClass(body, this.pageName);

    if (this.enableNavbarTransparent && this.navbarEl) {
      this.r.removeClass(this.navbarEl, 'navbar-transparent');
    }
  }
}
