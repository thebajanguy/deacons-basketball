import { Component, OnInit, Inject, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
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
import { environment } from '../../../../environments/environment';
import { LoggingService } from '../../../core/services/logging.service';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { BaseIdentityService } from '../~common/base-identity.service';


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
    imports: [
        CommonModule,
        MsalModule,
        NgbModule,
    ]
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


  constructor(protected override router: Router,
    @Inject(MSAL_GUARD_CONFIG) protected override msalGuardConfig: MsalGuardConfiguration,
    protected override  authService: MsalService,
    protected override  msalBroadcastService: MsalBroadcastService
  ) {
    super(router, msalGuardConfig,authService,msalBroadcastService);

    this.urlPath = this.utilitiesService.UrlRoutePath; 
    this.loginPath = this.utilitiesService.LoginRoutePath;  
    this.workspacePath = this.utilitiesService.WorkspaceRoutePath;  

    this.logginService.info("SignupSigninPage:constructor", "Method was called.");
    this.logginService.success("SignupSigninPage:constructor", "Method was called.");
  }

  ngOnInit(): void{
    super.OnInit();
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

}