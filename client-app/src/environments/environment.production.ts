export const environment = {
    production: true,
    useApiMock: false,                        // <- real API
    correspondenceApiBaseUrl: '/api',
    registrationApiBaseUrl: '/api',             // Functions default port
    stripePk: 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXX',   // <-- add this   
    appSettings: {
        applicationName: 'Varsity Sports Academy',
        siteUrl: `${window.location.origin}/`, //'http://localhost:5900/', // The redirect URI of the application, this should be same as the value in the application registration portal.Defaults to window.location.href.
        pageTitle: 'Academic & Sports Preparation',
        emailSentTo: 'VarsitySportsAcademy@Outlook.com',
        localUserStorageKey: 'local.authenticated.user',
        userTokenKey: 'msal.idtoken',
        urlRoutePath: 'academics-and-sports',
        loginRoutePath: 'academics-and-sports',
        workspaceRoutePath: 'user-workspace',
        membershipRoutePath: 'membership',
        defaultLanguage: 'en'
    },
    msalConfig: {
        auth: {
            clientId: 'ff1655e5-419b-4c2a-acb4-565e7176f9cc',
            redirectUri: '/en/user-workspace/dashboard',
            postLogoutRedirectUri: '/en/membership',
            loginFailedRoute: '/login-failed',
        }
    },
    apiConfig: {
        protectedResources: {
            graphApi: {
                uri: 'https://graph.microsoft.com/v1.0/me',
                scopes: ['User.Read'],
            }
          }
    },
    b2cPolicies: {
        names: {
            signUpSignIn: 'B2C_1_signup_signin',
            editProfile: 'B2C_1_profile_edit',
            resetPassword: 'B2C_1_password_reset',
            signUp: 'B2C_1_signup_only',
        },
        authorities: {
            signUpSignIn: {
                authority: 'https://Prodigy2Pro.b2clogin.com/Prodigy2Pro.onmicrosoft.com/b2c_1_signup_signin'
            },
            resetPassword: {
                authority: 'https://Prodigy2Pro.b2clogin.com/Prodigy2Pro.onmicrosoft.com/b2c_1_password_reset'
            },
            editProfile: {
                authority: 'https://Prodigy2Pro.b2clogin.com/Prodigy2Pro.onmicrosoft.com/b2c_1_profile_edit'
            },
            signUp: {
                authority: 'https://Prodigy2Pro.b2clogin.com/Prodigy2Pro.onmicrosoft.com/b2c_1_signup_only'
            }
        },
        authorityDomain: 'Prodigy2Pro.b2clogin.com',
        cache: {
            cacheLocation: 'localStorage', // CacheLocation: 'localStorage' | 'sessionStorage'
        }     
    }
};

