import {
    DestroyRef,
    Inject,
    Injectable,
    inject,
  } from '@angular/core';
  import { Router } from '@angular/router';
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
    PromptValue,
  } from '@azure/msal-browser';
  import { filter } from 'rxjs/operators';
  import { ActiveUser } from './models/active-user.type';
  import { IdentityService } from './services/identity.service';
  import { environment } from '../../../../environments/environment';
  import { CoreNotificationsService } from '../../../core/notifications/notifications.service';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  
  type IdTokenClaimsWithPolicyId = IdTokenClaims & {
    acr?: string;
    tfp?: string;
  };
  
  @Injectable({ providedIn: 'root' })
  export class BaseIdentityService {
    protected readonly identityService = inject(IdentityService);
    protected readonly notificationService = inject(CoreNotificationsService);
    protected readonly destroyRef = inject(DestroyRef);
  
    protected activeUser!: ActiveUser;
    protected isIframe = false;
    protected loginDisplay = false;
  
    constructor(
      protected readonly router: Router,
      @Inject(MSAL_GUARD_CONFIG)
      protected readonly msalGuardConfig: MsalGuardConfiguration,
      protected readonly authService: MsalService,
      protected readonly msalBroadcastService: MsalBroadcastService
    ) {}
  
    /** Call this from ngOnInit of the subclass */
    protected OnInit(): void {
      // Redirect handler
      this.authService.handleRedirectObservable().subscribe();
  
      this.isIframe = window !== window.parent && !window.opener;
  
      this.setLoginDisplay();
  
      // Optional account storage events (multi-tab)
      this.authService.instance.enableAccountStorageEvents();
  
      /** ACCOUNT_ADDED / ACCOUNT_REMOVED */
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.ACCOUNT_ADDED ||
              msg.eventType === EventType.ACCOUNT_REMOVED
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          const accounts = this.authService.instance.getAllAccounts();
          if (accounts.length === 0) {
            this.notificationService.showInfo(
              'M1-msalBroadcastService.msalSubject$',
              'No accounts found, redirecting to root',
              {}
            );
            window.location.pathname = '/';
          } else {
            this.notificationService.showInfo(
              'M2-msalBroadcastService.msalSubject$',
              `Accounts found: ${accounts.length}`,
              {}
            );
            this.setLoginDisplay();
          }
        });
  
      /** In-progress → None */
      this.msalBroadcastService.inProgress$
        .pipe(
          filter(
            (status: InteractionStatus) =>
              status === InteractionStatus.None
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.setLoginDisplay();
          this.checkAndSetActiveAccount();
        });
  
      /** LOGIN / TOKEN / SSO success */
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.LOGIN_SUCCESS ||
              msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
              msg.eventType === EventType.SSO_SILENT_SUCCESS
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((result: EventMessage) => {
          const payload = result.payload as AuthenticationResult;
          const idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;
  
          this.notificationService.showInfo(
            'M4-msalBroadcastService.msalSubject$',
            `IdToken policy: ${idtoken.acr ?? idtoken.tfp}`,
            {}
          );
  
          // SUSI login – set active account
          if (
            idtoken.acr === environment.b2cPolicies.names.signUpSignIn ||
            idtoken.tfp === environment.b2cPolicies.names.signUpSignIn
          ) {
            this.authService.instance.setActiveAccount(payload.account);
          }
  
          // Edit profile completed → silently re-auth with SUSI
          if (
            idtoken.acr === environment.b2cPolicies.names.editProfile ||
            idtoken.tfp === environment.b2cPolicies.names.editProfile
          ) {
            const originalSignInAccount = this.authService.instance
              .getAllAccounts()
              .find(
                (account: AccountInfo) =>
                  account.idTokenClaims?.oid === idtoken.oid &&
                  account.idTokenClaims?.sub === idtoken.sub &&
                  ((account.idTokenClaims as IdTokenClaimsWithPolicyId)
                    .acr === environment.b2cPolicies.names.signUpSignIn ||
                    (account.idTokenClaims as IdTokenClaimsWithPolicyId)
                      .tfp === environment.b2cPolicies.names.signUpSignIn)
              );
  
            const signUpSignInFlowRequest: SsoSilentRequest = {
              authority:
                environment.b2cPolicies.authorities.signUpSignIn
                  .authority,
              account: originalSignInAccount,
            };
  
            this.authService.ssoSilent(signUpSignInFlowRequest);
          }
  
          // Reset password completed → force user to login again
          if (
            idtoken.acr === environment.b2cPolicies.names.resetPassword ||
            idtoken.tfp === environment.b2cPolicies.names.resetPassword
          ) {
            const signUpSignInFlowRequest:
              | RedirectRequest
              | PopupRequest = {
              authority:
                environment.b2cPolicies.authorities.signUpSignIn
                  .authority,
              scopes: [
                ...environment.apiConfig.protectedResources.graphApi
                  .scopes,
              ],
              prompt: PromptValue.LOGIN,
            };
  
            this.login(signUpSignInFlowRequest);
          }
  
          return result;
        });
  
      /** LOGIN / TOKEN failure (reset password) */
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.LOGIN_FAILURE ||
              msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((result: EventMessage) => {
          if (
            result.error &&
            result.error.message.includes('AADB2C90118')
          ) {
            const resetPasswordFlowRequest:
              | RedirectRequest
              | PopupRequest = {
              authority:
                environment.b2cPolicies.authorities.resetPassword
                  .authority,
              scopes: [],
            };
  
            this.login(resetPasswordFlowRequest);
          }
        });
    }
  
    /** Call this from ngOnDestroy of the subclass */
    protected OnDestroy(): void {
      // No manual teardown needed: takeUntilDestroyed handles all streams
    }
  
    protected setLoginDisplay(): void {
      this.loginDisplay =
        this.authService.instance.getAllAccounts().length > 0;
  
      if (this.loginDisplay) {
        this.notificationService.showInfo(
          'setLoginDisplay()',
          `loginDisplay: ${this.loginDisplay}`,
          {}
        );
      }
    }
  
    private redirectIfIdentityPage(): void {
      if (
        this.loginDisplay &&
        window.location.href.includes('membership')
      ) {
        this.router.navigateByUrl(
          environment.msalConfig.auth.redirectUri
        );
      }
    }
  
    protected checkAndSetActiveAccount(): void {
      this.identityService.RemoveStorageItems();
  
      let activeAccount = this.authService.instance.getActiveAccount();
  
      if (!activeAccount) {
        const accounts = this.authService.instance.getAllAccounts();
        if (accounts.length > 0) {
          this.authService.instance.setActiveAccount(accounts[0]);
          activeAccount = this.authService.instance.getActiveAccount();
        }
      }
  
      if (activeAccount) {
        let name = activeAccount.name ?? '';
        if (name.includes('unknown')) {
          name = '';
        }
  
        this.activeUser = {
          homeAccountId: activeAccount.homeAccountId,
          environment: activeAccount.environment,
          tenantId: activeAccount.tenantId,
          username: activeAccount.username,
          localAccountId: activeAccount.localAccountId,
          name,
          authorityType: activeAccount.authorityType,
        };
  
        this.identityService.SetActiveUser = this.activeUser;
        this.notificationService.showInfo(
          'checkAndSetActiveAccount()',
          `activeUser: ${JSON.stringify(this.activeUser)}`,
          {}
        );
      }
  
      this.redirectIfIdentityPage();
    }
  
    protected login(
      userFlowRequest?: RedirectRequest | PopupRequest
    ): void {
      this.identityService.RemoveStorageItems();
  
      if (
        this.msalGuardConfig.interactionType ===
        InteractionType.Popup
      ) {
        const request = this.msalGuardConfig.authRequest
          ? ({
              ...this.msalGuardConfig.authRequest,
              ...userFlowRequest,
            } as PopupRequest)
          : (userFlowRequest as PopupRequest | undefined);
  
        this.authService.loginPopup(request).subscribe(
          (response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
            this.notificationService.showInfo(
              'loginPopup()',
              `activeAccount: ${this.authService.instance.getActiveAccount()}`,
              {}
            );
            this.checkAndSetActiveAccount();
          }
        );
      } else {
        const request = this.msalGuardConfig.authRequest
          ? ({
              ...this.msalGuardConfig.authRequest,
              ...userFlowRequest,
            } as RedirectRequest)
          : (userFlowRequest as RedirectRequest | undefined);
  
        this.notificationService.showInfo(
          'loginRedirect()',
          `activeAccount: ${this.authService.instance.getActiveAccount()}`,
          {}
        );
        this.authService.loginRedirect(request);
      }
    }
  
    protected logout(): void {
      this.identityService.RemoveStorageItems();
  
      if (
        this.msalGuardConfig.interactionType ===
        InteractionType.Popup
      ) {
        this.authService.logoutPopup({
          mainWindowRedirectUri: '/',
        });
      } else {
        this.authService.logoutRedirect();
      }
    }
  
    protected editProfile(): void {
      const editProfileFlowRequest:
        | RedirectRequest
        | PopupRequest = {
        authority:
          environment.b2cPolicies.authorities.editProfile.authority,
        scopes: [],
      };
  
      this.login(editProfileFlowRequest);
    }
  }
  