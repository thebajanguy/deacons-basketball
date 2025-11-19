import { Directive, OnInit, OnDestroy, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Directive() // no selector/template—pure base
export abstract class BasePageComponent implements OnInit, OnDestroy {
  protected utilitiesService = inject(UtilitiesService);
  protected sanitizer = inject(DomSanitizer);
  protected platformId = inject(PLATFORM_ID);

  /** Each page must set this; used to toggle a body class */
  abstract pageName: string;

  /** Optional: toggle navbar transparent */
  protected enableNavbarTransparent = true;

  /** Selector for main navbar (adjust if needed) */
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

  // Needed for Welcome Modal
  onModalClosed(reason: 'x'|'overlay'|'dismiss'|'dont-show'|'primary') {
      console.log('modal closed:', reason);
  }
  getSafeHtml(dirty:string): SafeHtml {
      // sanitize text to allow HTML formatting like <em>, <strong>, etc.
     return this.sanitizer.bypassSecurityTrustHtml(dirty);
  }
  openWhatsApp() {
    window.open('https://wa.me/17186370566?text=Hi%20Deacons%20Basketball%20Club%2C%20I%27d%20like%20to%20join!', '_blank');
  }
  // In the same component.ts
  openMap(): void {
    const mapUrl =
        'https://www.google.com/maps/search/?api=1&query=13.11678,-59.62208';
    window.open(mapUrl, '_blank');
  }

  openOutlookApp(recipient:string, subject:string, body:string): void {
    //const recipient = 'DeaconsBC@outlook.com';
    //const subject = encodeURIComponent('Inquiry from Website');
    //const body = encodeURIComponent('Hi Deacons Basketball Club,');
  
    try {
      // Try to open Outlook desktop app directly (compose window)
      window.location.href = `ms-outlook://compose?to=${recipient}&subject=${subject}&body=${body}`;
  
      // Fallback: open Outlook Web (new message draft)
      setTimeout(() => {
        window.open(
          `https://outlook.live.com/mail/deeplink/compose?to=${recipient}&subject=${subject}&body=${body}`,
          '_blank'
        );
      }, 1000);
    } catch (error) {
      console.error('Unable to open Outlook app:', error);
      window.open(
        `https://outlook.live.com/mail/deeplink/compose?to=${recipient}&subject=${subject}&body=${body}`,
        '_blank'
      );
    }
  }
 
  openTelephoneApp(phoneNumber: string): void {
    if (!phoneNumber) {
      console.warn("No phone number provided.");
      return;
    }
  
    // Remove spaces, dashes, parentheses
    const sanitized = phoneNumber.replace(/[\s()-]/g, '');
  
    // Basic validation
    const isValid = /^[0-9+]+$/.test(sanitized);
    if (!isValid) {
      console.error("Invalid phone number format:", phoneNumber);
      return;
    }
  
    // Attempt to open the dialer
    const telUrl = `tel:${sanitized}`;
    window.location.href = telUrl;
  }
  
  
}
