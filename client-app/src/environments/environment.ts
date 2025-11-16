export const environment = {
  production: false,
  useApiMock: true,                         // <- toggle this
  correspondenceApiBaseUrl: '',             // Functions default port
  registrationApiBaseUrl: '',             // Functions default port

  appSettings: {
    applicationName: '',
    siteUrl: '', //'http://localhost:5900/', // The redirect URI of the application, this should be same as the value in the application registration portal.Defaults to window.location.href.
    pageTitle: '',
    emailSentTo: '',
    localUserStorageKey: '',
    userTokenKey: '',
    urlRoutePath: '',
    loginRoutePath: '',
    workspaceRoutePath: '',
    membershipRoutePath: '',
    defaultLanguage: ''  
  },
  msalConfig: {
    auth: {
      clientId: '',
      redirectUri: '',
      postLogoutRedirectUri: '',
      loginFailedRoute: '',
    }
  },
  apiConfig: {
    protectedResources: {
      graphApi: {
        scopes: [""],
        uri: ""
      }
    }
  },
  b2cPolicies: {
      names: {
          signUpSignIn: '',
          resetPassword: '',
          editProfile: ''
      },
      authorities: {
        signUpSignIn: {
          authority: ''
      },
      resetPassword: {
          authority: ''
      },
      editProfile: {
          authority: ''
      },
      signUp: {
          authority: ''
      }
},
      authorityDomain: '',
      cache: {
        cacheLocation: '', // CacheLocation: 'localStorage' | 'sessionStorage'
    } 
  }
};
