export interface ILoginUser {
    localAccountId : string;        // = result?.localAccountId;
    givenName : string;             // = result?.idTokenClaims?.given_name;
    familyName : string;            // = result?.idTokenClaims?.family_name;
    country : string;               // = ''; //result?.idTokenClaims?.idToken.country;
    email  : string;                // = result?.localAccountId; //result?.username; //(result.username) ? result?.idTokenClaims?.emails[0] : '';
    mobilePhone : string;           // = '';
    preferredLanguage : string;     // = '';
    userPrincipalName : string;     // = result?.localAccountId;
    timeZone: string;               // = ''
    avatar : string;                // = '/assets/no-profile-photo.png';
    identityProviderId : string;    // = result?.idTokenClaims?.aud;
    environment: string;            // ="Prodigy2Pro.b2clogin.com",

    displayName() : string;         //displayName: () => `${givenName} ${famillyName}`             //= `${result?.idTokenClaims?.given_name} ${result?.idTokenClaims?.family_name}`;
}

const loginUser: ILoginUser = {
    localAccountId: "49adcff3-bd50-4706-9464-d4a9f1169cff",
    givenName: "Alvin",
    familyName: "Brathwaite",
    country: "",
    email: "",
    mobilePhone: "",
    preferredLanguage: "",
    userPrincipalName: "",
    timeZone: "",
    avatar: "",
    identityProviderId: "",
    environment: "",
    displayName: function (): string {
        return `${this.givenName} ${this.familyName}`;
    },
};