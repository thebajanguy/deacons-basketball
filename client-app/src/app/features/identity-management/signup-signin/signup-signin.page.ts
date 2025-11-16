import { Component, OnInit, Inject, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink} from '@angular/router';
import { Meta, Title, SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// MSAL CONFIGURARTION : BEGIN
import {
  MsalService,
  MsalModule,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import { 
  PopupRequest, 
  RedirectRequest, 
  IdTokenClaims, 
  PromptValue 
} from '@azure/msal-browser';
// MSAL CONFIGURARTION : END

import { BaseIdentityService } from '../~common/base-identity.service';
import { environment } from '../../../../environments/environment';
import { LoggingService } from '../../../core/services/logging.service';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { BaseHeroComponent } from "../../user-experience/~common/components/base-hero/base-hero.component";
import { BasePageComponent } from '../../../core/directives/base-page.directive';
import { SocialPluginComponent } from "../../user-experience/~common/components/social-plugin/social-plugin.component";


type IdTokenClaimsWithPolicyId = IdTokenClaims & {
    acr?: string,
    tfp?: string,
};
// MSAL CONFIGURARTION : END


@Component({
    selector: 'app-signup-signin',
    templateUrl: './signup-signin.page.html',
    styleUrl: './signup-signin.page.scss',
    standalone: true,
    imports: [CommonModule, RouterLink, MsalModule, NgbModule, BaseHeroComponent, SocialPluginComponent]
})
export class SignupSigninPage extends BaseIdentityService implements OnInit, OnDestroy {

  public showAllPricing = 'true';
  public showAthletePricing = 'false';
  public showCoachPricing = 'false';

  logginService = inject(LoggingService);
  utilitiesService = inject(UtilitiesService);
  urlPath: string = ''; 
  loginPath: string = ''; 
  workspacePath: string = ''; 

  pageName = 'vsa-page';

  //description = `Join Deacons Basketball Club™ to build your recruiting profile, improve performance, and get
  //real exposure through showcases, camps, and combines.`;
  description = `
  <span class="title text-success">Propel my career.</span>&nbsp;
  <span class="title text-info">Propel my child.</span>&nbsp;
  <span class="title text-danger">Propel my team.</span>&nbsp;
`.trim();  
  safeDescription: SafeHtml = '';



  constructor(protected override router: Router,
    @Inject(MSAL_GUARD_CONFIG) protected override msalGuardConfig: MsalGuardConfiguration,
    protected override  authService: MsalService,
    protected override  msalBroadcastService: MsalBroadcastService,

    private title: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object  
  
    ) {
    super(router, msalGuardConfig,authService,msalBroadcastService);
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.description);


    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
    this.workspacePath = this.utilitiesService.WorkspaceRoutePath;  

    this.logginService.info("SignupSigninPage:constructor", "Method was called.");
    this.logginService.success("SignupSigninPage:constructor", "Method was called.");
  }

  ngOnInit(): void{
    super.OnInit();

    this.title.setTitle('Why Join Deacons Basketball Club™ | Recruiting, Training & Exposure');
    this.meta.updateTag({ name: 'description', content: 'Membership at Deacons Basketball Club™ unlocks personalized recruiting plans, performance training, and real exposure through showcases, camps, and combines.' });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    this.meta.updateTag({ property: 'og:title', content: 'Deacons Basketball Club™ Membership' });
    this.meta.updateTag({ property: 'og:description', content: 'Personalized recruiting, performance training, and showcases to get noticed.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/img/og/deacons-basketball-membership.jpg' });
    this.meta.updateTag({ property: 'og:url', content: 'https://your-domain.com/membership' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Deacons Basketball Club™ Membership' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Recruiting, training & exposure for student-athletes.' });
    this.meta.updateTag({ name: 'twitter:image', content: '/assets/img/og/deacons-basketball-membership.jpg' });
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });

    if (isPlatformBrowser(this.platformId)) {
      this.injectJsonLd(this.organizationJsonLd());
      this.injectJsonLd(this.webPageJsonLd());
      this.injectJsonLd(this.faqJsonLd());
    }
  }

  ngOnDestroy(): void {
    super.OnDestroy();
  }

  //
  edit(){
    this.editProfile();
  }
  signOut(){
    this.logout();
  }
  signIn() {
    let signUpSignInFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };

    this.login(signUpSignInFlowRequest)
  }
  signUp() {
    let signUpFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUp.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };

    this.login(signUpFlowRequest)
  }

  //---
  private injectJsonLd(data: object): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  private organizationJsonLd() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Deacons Basketball Club",
      "url": "https://your-domain.com/",
      "logo": "https://your-domain.com/assets/img/brand/vsa-logo.png",
      "sameAs": [
        "https://www.instagram.com/yourhandle",
        "https://www.facebook.com/yourhandle",
        "https://www.youtube.com/@yourhandle"
      ]
    };
  }

  private webPageJsonLd() {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Why Join Deacons Basketball Club",
      "url": "https://your-domain.com/membership",
      "description": "Membership benefits for student-athletes: recruiting, training, showcases, camps, and combines."
    };
  }

  private faqJsonLd() {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who should join Deacons Basketball Club?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Student-athletes seeking college exposure, performance improvement, and guidance through the recruiting process."
          }
        },
        {
          "@type": "Question",
          "name": "What do I get with membership?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Personalized recruiting plans, highlight video support, training programs, showcases, and application/scholarship guidance."
          }
        },
        {
          "@type": "Question",
          "name": "Do you help international students?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We support Caribbean and international student-athletes with NCAA alignment, showcases, and coach outreach."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a consultation first?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Book a free consultation to discuss your goals and the best pathway for recruiting and development."
          }
        }
      ]
    };
  }

}