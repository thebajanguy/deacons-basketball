// navbar.component.ts
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RedirectRequest, PopupRequest, PromptValue } from '@azure/msal-browser';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-navbar-cmp',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgbCollapseModule, NgbDropdownModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy,  AfterViewInit {
  private readonly route = inject(ActivatedRoute);

  @ViewChild('navbarToggler', { static: true }) toggleButton!: ElementRef<HTMLButtonElement>;

  private sidebarVisible = false;
  isMenuActive = false;

 // @Input() loginDisplay: boolean = false;
  @Input() urlPath = '';
  @Input() membershipPath = '';
  @Input() shouldDisplayLogin = false;

  @Output() signInToParent = new EventEmitter<any>();
  @Output() signOutToParent = new EventEmitter();
  @Output() signUpToParent = new EventEmitter<any>();
  @Output() editProfileToParent = new EventEmitter();

  isCollapsed = true;
  searchTerm = '';
  navOpen = false;


  // Make user nullable to reflect auth state
  user: { firstName: string; avatarUrl: string } | null = null;

// Example: set this.user when your auth resolves
// user = { firstName: 'Alvin', avatarUrl: 'assets/img/defaults/default-avatar.png' }; // replace with real user model
// or when signed out:
// this.user = null;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    protected router: Router,
    public location: Location,
    private element: ElementRef
  ) {}

  get lang() { return this.route.snapshot.paramMap.get('lang') || 'en'; }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const nav = document.querySelector('.navbar');
    nav?.removeAttribute('color-on-scroll');
    nav?.classList.remove('navbar-transparent', 'navbar-color-on-scroll');
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle(); // keeps your burger animation + body class sync
  }
  onSearch(evt: Event) {
    alert('onSearch');

    evt.preventDefault();
    const q = (this.searchTerm || '').trim();
    if (!q) return;
    alert(`onSearch: ${q} `);
    // Navigate to your search results route
    // this.router.navigate(['/search'], { queryParams: { q } });
    console.log('Searching:', q);
  }
  openSearch(): void {
    // Replace this with your actual modal or router logic
    console.log('Search modal would open here');
  }
  

//*
  sidebarOpen() {
    const html = document.documentElement;
    setTimeout(() => this.toggleButton.nativeElement.classList.add('toggled'), 500);
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.documentElement;
    this.toggleButton.nativeElement.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }
  sidebarToggle() {
    this.sidebarVisible ? this.sidebarClose() : this.sidebarOpen();
  }
  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
  }
//*/
  isHome() {
    const titlee = this.location.prepareExternalUrl(this.location.path());
    return titlee === '/home';
  }
  isDocumentation() {
    const titlee = this.location.prepareExternalUrl(this.location.path());
    return titlee === '/documentation';
  }

  ngOnDestroy(): void {}

  // Identity Management
  logout() {
    // Call your auth service
    console.log('Signing out…');
  }

/*
  signOut(){
    this.user = null;
    this.signOutToParent.emit();
  }
  signIn() {
    this.signInToParent.emit({
      prompt: 'login'
    });
  }
  signUp() {
    this.signUpToParent.emit({
      prompt: 'login'
    });
  }
  profileEdit() {
    this.editProfileToParent.emit();
  }
*/
  //
  signOut(){
    this.user = null;
    this.signOutToParent.emit();
  }
  signIn() {
    let signUpSignInFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };

    alert('NavbarComponent-signIn: ' + JSON.stringify(signUpSignInFlowRequest) );
    this.signInToParent.emit(signUpSignInFlowRequest);
  }
  signUp() {
    let signUpFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUp.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };
    this.signUpToParent.emit(signUpFlowRequest);
  }
  profileEdit() {
    this.editProfileToParent.emit();
  }

/*
  //
  signOut(){
    this.signOutToParent.emit();
    //this.logout();
  }
  signIn() {
    let signUpSignInFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };

    alert('UserExperienceNavbarComponent-signIn: ' + JSON.stringify(signUpSignInFlowRequest) );
    this.signInToParent.emit(signUpSignInFlowRequest);
    //this.login(signUpSignInFlowRequest)
  }
  signUp() {
    let signUpFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.signUp.authority,
      scopes: [],
      prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
    };
    this.signUpToParent.emit(signUpFlowRequest);
    //this.login(signUpFlowRequest)
  }
  profileEdit() {
    this.editProfileToParent.emit();
  }
    */
}
