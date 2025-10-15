import { ILoginUser } from "../interfaces/i.login.user";

class LoginUserModel implements ILoginUser {
    localAccountId: string;
    givenName: string;
    familyName: string;
    country: string;
    email: string;
    mobilePhone: string;
    preferredLanguage: string;
    userPrincipalName: string;
    timeZone: string;
    avatar: string;
    identityProviderId: string;
    environment: string;

    constructor(
        localAccountId: string,
        givenName: string,
        familyName: string,
        country: string,
        email: string,
        mobilePhone: string,
        preferredLanguage: string,
        userPrincipalName: string,
        timeZone: string,
        avatar: string,
        identityProviderId: string,
        environment: string
     )
    {
        this.localAccountId = localAccountId;
        this.givenName = givenName;
        this.familyName = familyName;
        this.country = country;
        this.email = email;
        this.mobilePhone = mobilePhone;
        this.preferredLanguage = preferredLanguage;
        this.userPrincipalName = userPrincipalName;
        this.timeZone = timeZone;
        this.avatar = avatar;
        this.identityProviderId = identityProviderId;
        this.environment = environment;
    }
    displayName() {
        return `${this.givenName} ${this.familyName}`;
    }
}


/*
    account
    {
      "homeAccountId": "49adcff3-bd50-4706-9464-d4a9f1169cff-b2c_1_signup_signin.a5472f1f-1ab6-482c-92ca-2cd7763e3918",
      "environment": "Prodigy2Pro.b2clogin.com",
      "tenantId": "",
      "username": "AlvinBrathwaite@outlook.com",
      "localAccountId": "49adcff3-bd50-4706-9464-d4a9f1169cff",
      "name": "Alvin",
      "idTokenClaims": {
          "exp": 1668310431,
          "nbf": 1668306831,
          "ver": "1.0",
          "iss": "https://Prodigy2Pro.b2clogin.com/a5472f1f-1ab6-482c-92ca-2cd7763e3918/v2.0/",
          "sub": "49adcff3-bd50-4706-9464-d4a9f1169cff",
          "aud": "635f135f-ac63-46d7-b71b-1fb4b9057903",
          "nonce": "8eb9ae23-f10b-419f-baf2-deaa1e9cc1a3",
          "iat": 1668306831,
          "auth_time": 1668306830,
          "oid": "49adcff3-bd50-4706-9464-d4a9f1169cff",
          "name": "Alvin",
          "given_name": "Alvin",
          "family_name": "Brathwaite",
          "emails": [
              "AlvinBrathwaite@outlook.com"
          ],
          "tfp": "B2C_1_signup_signin"
      }
    }
    */

