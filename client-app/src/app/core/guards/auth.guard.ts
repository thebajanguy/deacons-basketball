import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = () => {
    const auth = inject(MsalService);
    const router = inject(Router);
    let accounts = auth.instance.getAllAccounts();
    if (accounts.length > 0) return true;
    router.navigate(['/account', { redirectUrl: location.pathname }]);
    return false;
};