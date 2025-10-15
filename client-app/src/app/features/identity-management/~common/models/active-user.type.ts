import { TokenClaims } from "@azure/msal-common";

/**
 * Account object with the following signature:
 * - homeAccountId          - Home account identifier for this account object
 * - environment            - Entity which issued the token represented by the domain of the issuer (e.g. login.microsoftonline.com)
 * - tenantId               - Full tenant or organizational id that this account belongs to
 * - username               - preferred_username claim of the id_token that represents this account
 * - localAccountId         - Local, tenant-specific account identifer for this account object, usually used in legacy cases
 * - name                   - Full name for the account, including given name and family name
 * - idToken                - raw ID token
 * - idTokenClaims          - Object contains claims from ID token
 * - localAccountId         - The user's account ID
 * - nativeAccountId        - The user's native account ID
 */

export declare type ActiveUser = {
    /*
    "homeAccountId":"38bc03ea-0c71-4914-8997-0269a6549ac5-b2c_1_signup_signin.790dd3aa-2d53-4a2c-9c4b-93d600440a19",
    "environment":"prodigy2pro.b2clogin.com",
    "tenantId":"B2C_1_signup_signin",
    "username":"alvinbrathwaite@outlook.com",
    "localAccountId":"38bc03ea-0c71-4914-8997-0269a6549ac5",
    "name":"unknown",
    "authorityType":"MSSTS"
    */
    homeAccountId?: string;
    environment?: string;
    tenantId?: string;
    username?: string;
    localAccountId?: string;
    name?: string;
    authorityType?: string;
}

export declare type ActiveUserType = {
    homeAccountId?: string;
    environment?: string;
    tenantId?: string;
    username?: string;
    localAccountId?: string;
    name?: string;
    authorityType?: string;

    givenName?: string;
    surname?: string;
    displayName?: string;

    avatar?: string;
};

export declare type  ProfileType = {
    givenName?: string;
    surname?: string;
    userPrincipalName?: string;
    id?: string;
  };
