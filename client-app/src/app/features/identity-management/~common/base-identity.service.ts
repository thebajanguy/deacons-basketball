import { Inject, inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router} from '@angular/router';

// MSAL CONFIGURARTION : BEGIN
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import { 
  AuthenticationResult, 
  InteractionStatus, 
  PopupRequest, 
  RedirectRequest, 
  EventMessage, 
  EventType, 
  InteractionType, 
  AccountInfo, 
  SsoSilentRequest, 
  IdTokenClaims, 
  PromptValue 
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ActiveUser } from './models/active-user.type';
import { IdentityService } from './services/identity.service';
import { environment } from '../../../../environments/environment';
import { CoreNotificationsService } from '../../../core/notifications/notifications.service';


type IdTokenClaimsWithPolicyId = IdTokenClaims & {
    acr?: string,
    tfp?: string,
};
// MSAL CONFIGURARTION : END

/******************* */
@Injectable({providedIn: 'root'})
export class BaseIdentityService  {
    identityService = inject(IdentityService);
    notificationService = inject(CoreNotificationsService);

    protected activeUser!: ActiveUser;

    protected subscriptions: Subscription[] = [];

    protected title = 'Varsity Sports Academy Prep Profiles';
    protected isIframe = false;
    protected loginDisplay = false;
    protected readonly _destroying$ = new Subject<void>();
  
    constructor(protected router: Router,
      @Inject(MSAL_GUARD_CONFIG) protected  msalGuardConfig: MsalGuardConfiguration,
      protected  authService: MsalService,
      protected  msalBroadcastService: MsalBroadcastService
    ) {

    }
  
    protected OnInit(): void {

      // BEGIN: MSAL User Authentication
      this.authService.handleRedirectObservable().subscribe();
      this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
  
      this.setLoginDisplay();
  
      this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
      this.msalBroadcastService.msalSubject$
      .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
          if (this.authService.instance.getAllAccounts().length === 0) {
              window.location.pathname = "/";
              this.notificationService.showInfo("M1-msalBroadcastService.msalSubject$.subscribe", `getAllAccounts().length === 0 ${this.authService.instance.getAllAccounts().length}`, {});
          } else {
            this.notificationService.showInfo("M2-msalBroadcastService.msalSubject$.subscribe", `getAllAccounts().length === 0 ${this.authService.instance.getAllAccounts().length}`, {});
            this.setLoginDisplay();
          }
      });
  
      this.msalBroadcastService.inProgress$
      .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
      )
      .subscribe(() => {
            /* THIS IS CALLED MOST IF NOT ALL THE TIME */
           // this.notificationService.showInfo("M3-msalBroadcastService.inProgress$.subscribe", `status ${JSON.stringify(InteractionStatus)}`, {});
            this.setLoginDisplay();
            this.checkAndSetActiveAccount();
      })
  
      this.msalBroadcastService.msalSubject$
      .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS 
              || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS 
              || msg.eventType === EventType.SSO_SILENT_SUCCESS),
          takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
  
          let payload = result.payload as AuthenticationResult;
          let idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;
  
          this.notificationService.showInfo("M4-msalBroadcastService.msalSubject$.subscribe", `IdTokenClaimsWithPolicyId - ${idtoken.acr}`, {});
  
          if (idtoken.acr === environment.b2cPolicies.names.signUpSignIn || idtoken.tfp === environment.b2cPolicies.names.signUpSignIn) {
              this.authService.instance.setActiveAccount(payload.account);
          }
          
          /**
           * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
           * from SUSI flow. "acr" claim in the id token tells us the policy (NOTE: newer policies may use the "tfp" claim instead).
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (idtoken.acr === environment.b2cPolicies.names.editProfile || idtoken.tfp === environment.b2cPolicies.names.editProfile) {
  
              // retrieve the account from initial sing-in to the app
              const originalSignInAccount = this.authService.instance.getAllAccounts()
                  .find((account: AccountInfo) =>
                          account.idTokenClaims?.oid === idtoken.oid
                          && account.idTokenClaims?.sub === idtoken.sub
                          && ((account.idTokenClaims as IdTokenClaimsWithPolicyId).acr === environment.b2cPolicies.names.signUpSignIn
                              || (account.idTokenClaims as IdTokenClaimsWithPolicyId).tfp === environment.b2cPolicies.names.signUpSignIn)
                      );
                      
              let signUpSignInFlowRequest: SsoSilentRequest = {
                  authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
                  account: originalSignInAccount
              };
  
              // silently login again with the signUpSignIn policy
              this.authService.ssoSilent(signUpSignInFlowRequest);
          }
  
          /**
           * Below we are checking if the user is returning from the reset password flow.
           * If so, we will ask the user to reauthenticate with their new password.
           * If you do not want this behavior and prefer your users to stay signed in instead,
           * you can replace the code below with the same pattern used for handling the return from
           * profile edit flow (see above ln. 74-92).
           */
          if (idtoken.acr === environment.b2cPolicies.names.resetPassword || idtoken.tfp === environment.b2cPolicies.names.resetPassword) {
              let signUpSignInFlowRequest: RedirectRequest | PopupRequest  = {
                  authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
                  scopes: [...environment.apiConfig.protectedResources.graphApi.scopes],
                  prompt: PromptValue.LOGIN // force user to reauthenticate with their new password
              };
  
              this.login(signUpSignInFlowRequest);
          }
  
          return result;
      });
  
      this.msalBroadcastService.msalSubject$
      .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
          takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
          // Check for forgot password error
          // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
          if (result.error && result.error.message.indexOf('AADB2C90118') > -1) {
              let resetPasswordFlowRequest: RedirectRequest | PopupRequest  = {
                  authority: environment.b2cPolicies.authorities.resetPassword.authority,
                  scopes: [],
              };
      
              this.login(resetPasswordFlowRequest);
          };
      });
    }
  
    protected OnDestroy(): void {
        this.cleanup();
        this._destroying$.next(undefined);
        this._destroying$.complete();
    }

    protected addSubscription(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    protected cleanup(): void {
        // Unsubscribe from all subscriptions to avoid memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    protected setLoginDisplay(): void  {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;  
        if(this.loginDisplay)
            this.notificationService.showInfo("setLoginDisplay():", `this.loginDisplay - ${this.loginDisplay}`, {});
    }
    private redirectIfIdentityPage() {
        if(this.loginDisplay && window.location.href.includes('membership')){
            let url = `${window.location.origin}${environment.msalConfig.auth.redirectUri}`;
            this.router.navigateByUrl(environment.msalConfig.auth.redirectUri);
            //this.router.navigate([environment.msalConfig.auth.redirectUri, {}]);
        }
    }
    
    protected checkAndSetActiveAccount(): void {
        /**
         * If no active account set but there are accounts signed in, sets first account to active account
         * To use active account set here, subscribe to inProgress$ first in your component
         * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
         */
        this.identityService.RemoveStorageItems();

        let activeAccount = this.authService.instance.getActiveAccount();

        if ( !activeAccount && this.authService.instance.getAllAccounts().length > 0 ) {
            let accounts = this.authService.instance.getAllAccounts();
            this.authService.instance.setActiveAccount(accounts[0]);
            activeAccount = this.authService.instance.getActiveAccount();
        }
        
        if(activeAccount){
            let name = activeAccount?.name;
            if(name == undefined || name.includes('unknown'))
                name = '';
            this.activeUser = {
                homeAccountId: activeAccount?.homeAccountId,
                environment: activeAccount?.environment,
                tenantId: activeAccount?.tenantId,
                username: activeAccount?.username,
                localAccountId: activeAccount?.localAccountId,
                name: name,
                authorityType: activeAccount?.authorityType       
            };

            this.identityService.SetActiveUser = this.activeUser;
            this.notificationService.showInfo("checkAndSetActiveAccount():", `this.activeUser - ${JSON.stringify(this.activeUser)}`, {});
        }
        
        this.redirectIfIdentityPage();
    }
    
    protected login(userFlowRequest?: RedirectRequest | PopupRequest) {
        this.identityService.RemoveStorageItems();

        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
            if (this.msalGuardConfig.authRequest) {
                this.authService.loginPopup({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as PopupRequest)
                    .subscribe((response: AuthenticationResult) => {
                        this.authService.instance.setActiveAccount(response.account);
                        this.notificationService.showInfo("M8-1-login():", `activeAccount - ${this.authService.instance.getActiveAccount()}`, {});
                        this.checkAndSetActiveAccount()
                    });
            } else {
                this.authService.loginPopup(userFlowRequest)
                    .subscribe((response: AuthenticationResult) => {
                        this.authService.instance.setActiveAccount(response.account);
                        this.notificationService.showInfo("M9-2-login():", `activeAccount - ${this.authService.instance.getActiveAccount()}`, {});
                        this.checkAndSetActiveAccount()
                    });
            }
        } else {
            if (this.msalGuardConfig.authRequest) {
                this.notificationService.showInfo("M10-1-login():", `activeAccount - ${this.authService.instance.getActiveAccount()}`, {});
                this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as RedirectRequest);
            } else {
                this.notificationService.showInfo("M11-1-login():", `activeAccount - ${this.authService.instance.getActiveAccount()}`, {});
                this.authService.loginRedirect(userFlowRequest);
            }
        }
    }

    protected logout():void  {
        this.identityService.RemoveStorageItems();

        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
            this.authService.logoutPopup({
                mainWindowRedirectUri: "/"
            });
        } else {
            this.authService.logoutRedirect();
        }
    }
    
    protected editProfile(): void {
        //*
        let editProfileFlowRequest: RedirectRequest | PopupRequest  = {
            authority: environment.b2cPolicies.authorities.editProfile.authority,
            scopes: [],
        };
        //*/
        this.login(editProfileFlowRequest);
    }

}
