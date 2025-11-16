import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FixedSocialPluginComponent } from "../user-experience/-shared/components/fixed-social-plugin/fixed-social-plugin.component";
import { FixedJoinNowPluginComponent } from "../user-experience/-shared/components/fixed-join-now-plugin/fixed-join-now-plugin.component";
import { UserWorkspaceNavbarComponent } from './~common/components/navbar/navbar.component';
import { UserWorkspaceSidebarComponent } from "./~common/components/sidebar/sidebar.component";
import { UserWorkspaceFooterComponent } from './~common/components/footer/footer.component';
import { FixedSettingsPluginComponent } from "./~common/components/fixed-settings-plugin/fixed-settings-plugin.component";
import { BaseIdentityService } from '../-identity-management/base/base-identity.service';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { UtilitiesService } from '../-core/services/utilities.service';
import { FixedWorkspacePluginComponent } from "./~common/components/fixed-workspace-plugin/fixed-workspace-plugin.component";

@Component({
    selector: 'app-user-workspace',
    standalone: true,
    templateUrl: './user-workspace.component.html',
    styleUrl: './user-workspace.component.scss',
    imports: [RouterOutlet, RouterLink, RouterLinkActive,
        UserWorkspaceNavbarComponent, UserWorkspaceSidebarComponent, UserWorkspaceFooterComponent,
        FixedSocialPluginComponent, FixedJoinNowPluginComponent, FixedSettingsPluginComponent, FixedWorkspacePluginComponent]
})
export class UserWorkspaceComponent extends BaseIdentityService implements OnInit, OnDestroy {
    utilitiesService = inject(UtilitiesService);
  
    urlPath: string = ''; 
    loginPath: string = ''; 
    workspacePath: string = ''; 
    dashboardPage: boolean = false;
    //loginDisplay: boolean = false;
  
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
      this.loginDisplay = (activeUser)? true : false;
      this.dashboardPage = window.location.href.includes('dashboard');
    }
  
    ngOnDestroy(): void {
      super.OnDestroy();
    }
  
    signInFromChild(request: any) {
        alert('UserWorkspaceComponent-signInFromChild: ' + JSON.stringify(request) );

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
