//
import { MsalInterceptorConfiguration, MsalGuardConfiguration } from "@azure/msal-angular";
import { LogLevel, IPublicClientApplication, PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { environment } from "../../../../../environments/environment";

//
export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      knownAuthorities: [environment.b2cPolicies.authorityDomain]
    },
    cache: {
      cacheLocation: environment.b2cPolicies.cache.cacheLocation, //BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Verbose,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map(
      [
        ['https://graph.microsoft.com/v1.0/me', ['User.Read']]
      ]
    )
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.apiConfig.protectedResources.graphApi.scopes],
    },
    loginFailedRoute: environment.msalConfig.auth.loginFailedRoute,
  };
}
