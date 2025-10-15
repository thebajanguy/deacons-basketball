import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { FixedJoinNowPluginComponent } from '../../user-experience/~common/components/fixed-join-now-plugin/fixed-join-now-plugin.component';
import { FixedSocialPluginComponent } from '../../user-experience/~common/components/fixed-social-plugin/fixed-social-plugin.component';
import { BaseIdentityService } from '../~common/base-identity.service';
import { IdentityManagementFooterComponent } from '../~common/components/footer/footer.component';
import { IdentityManagementNavbarComponent } from '../~common/components/navbar/navbar.component';



@Component({
    selector: 'app-identity-management-layout',
    standalone: true,
    templateUrl: './identity-management.layout.html',
    styleUrl: './identity-management.layout.scss',
    imports: [
    RouterOutlet,
    IdentityManagementNavbarComponent,
    IdentityManagementFooterComponent,
    FixedSocialPluginComponent,
    FixedJoinNowPluginComponent
]
})
export class IdentityManagementLayout extends BaseIdentityService implements OnInit, OnDestroy {
  utilitiesService = inject(UtilitiesService);

  urlPath: string = ''; 
  loginPath: string = ''; 

  workspacePath: string = ''; 
  shouldDisplayMembershipPage: boolean = false;
  shouldDisplayWorkspacePage: boolean = false;
  shouldDisplayLogin: boolean = false;
  shouldDisplayJoinNow: boolean = false;

  constructor(protected override router: Router,
    @Inject(MSAL_GUARD_CONFIG) protected override msalGuardConfig: MsalGuardConfiguration,
    protected override  authService: MsalService,
    protected override  msalBroadcastService: MsalBroadcastService
  ) {
    super(router, msalGuardConfig,authService,msalBroadcastService);
  }

  ngOnInit(): void{
    super.OnInit();

    let activeUser = this.identityService.GetActiveUser;

    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
    this.workspacePath = this.utilitiesService.WorkspaceRoutePath;  
    this.shouldDisplayLogin = (activeUser)? true : false;
    this.shouldDisplayMembershipPage = window.location.href.includes('membership');
    this.shouldDisplayJoinNow = window.location.href.includes('user-workspace');
  }

  ngOnDestroy(): void {
    super.OnDestroy();
  }

  signInFromChild(request: any) {
    alert('UserExperienceNavbarComponent-signInFromChild: ' + JSON.stringify(request) );

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
