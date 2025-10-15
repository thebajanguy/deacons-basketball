import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
  DestroyRef
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { DOCUMENT, Location } from '@angular/common';
import { Router, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { BaseIdentityService } from '../../identity-management/~common/base-identity.service';
import { FixedJoinNowPluginComponent } from '../~common/components/fixed-join-now-plugin/fixed-join-now-plugin.component';
import { FixedSocialPluginComponent } from '../~common/components/fixed-social-plugin/fixed-social-plugin.component';
import { FooterComponent } from '../~common/components/footer/footer.component';
import { NavbarComponent } from '../~common/components/navbar/navbar.component';

@Component({
  selector: 'app-user-experience-layout',
  standalone: true,
  templateUrl: './user-experience.layout.html',
  styleUrls: ['./user-experience.layout.scss'],
  imports: [
    RouterOutlet,
    FixedSocialPluginComponent,
    FixedJoinNowPluginComponent,
    NavbarComponent,
    FooterComponent
  ]
})
export class UserExperienceLayout extends BaseIdentityService implements OnInit, OnDestroy {
  utilitiesService = inject(UtilitiesService);
  private destroyRef = inject(DestroyRef);

  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  urlPath = '';
  membershipPath = '';
  workspacePath = '';
  shouldDisplayMembershipPage: boolean = false;
  shouldDisplayWorkspacePage: boolean = false;
  shouldDisplayLogin: boolean = false;
  shouldDisplayJoinNow: boolean = true;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private element: ElementRef,
    public location: Location,
    protected override router: Router,
    @Inject(MSAL_GUARD_CONFIG) protected override msalGuardConfig: MsalGuardConfiguration,
    protected override authService: MsalService,
    protected override msalBroadcastService: MsalBroadcastService
  ) {
    super(router, msalGuardConfig, authService, msalBroadcastService);
  }

  ngOnInit(): void {
    super.OnInit();

    const activeUser = this.identityService.GetActiveUser;

    this.loginDisplay = !!activeUser;

    this.urlPath = this.utilitiesService.UrlRoutePath;
    this.membershipPath = this.utilitiesService.LoginRoutePath;
    this.workspacePath = this.utilitiesService.WorkspaceRoutePath;
    this.shouldDisplayWorkspacePage = window.location.href.includes('user-workspace');
    this.shouldDisplayMembershipPage = window.location.href.includes('membership');
    this.shouldDisplayLogin = this.loginDisplay;
    this.shouldDisplayJoinNow  = false;

    // ONE scroll listener for the lifetime of this component
    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onScroll());

    // React only to NavigationEnd (type-safe)
    this.router.events
      .pipe(
        filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onNavEnd());

    // IE 11 legacy class (kept from your code, harmless if unused)
    const ua = window.navigator.userAgent;
    const trident = ua.indexOf('Trident/');
    let version: number | null = null;
    if (trident > 0) {
      const rv = ua.indexOf('rv:');
      version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    if (version) {
      this.document.body.classList.add('ie-background');
    }

    var navbar = this.document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

  }

  private onNavEnd() {
    if (this.location.path() !== '/sections') {
      if (window.outerWidth > 991) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
    this.navbar?.sidebarClose();
  }

  private onScroll() {
    const path = this.location.path();
    const basePath = path.split('#')[0];
    if (basePath === '/sections') return;

    // Get the navbar element once per event (query by class is safer than child indexing)
    const navbarEl = this.document.querySelector('.navbar') as HTMLElement | null;
    if (!navbarEl) return;

    const segment = path.split('/')[2]; // may be undefined if shallow route
    const scrolledPast = window.scrollY > 150 || window.pageYOffset > 150;

    if (scrolledPast) {
      if (segment !== 'register') {
        this.renderer.removeClass(navbarEl, 'navbar-transparent');
      }
    } else if (
      segment !== 'addproduct' &&
      segment !== 'login' &&
      segment !== 'register' &&
      basePath !== '/nucleoicons'
    ) {
      this.renderer.addClass(navbarEl, 'navbar-transparent');
    }
  }

  ngOnDestroy(): void {
    super.OnDestroy();
  }

  // Child -> parent actions (left as-is)
  signInFromChild(request: any) {
    this.login(request);
  }
  signOutFromChild() {
    this.logout();
  }
  signUpFromChild(request: any) {
    this.login(request);
  }
  editProfileFromChild() {
    this.editProfile();
  }
}
