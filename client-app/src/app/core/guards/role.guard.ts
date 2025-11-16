import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

export const roleGuard = (roles: string[]): CanActivateFn => () => {
    const auth = inject(MsalService);
    const router = inject(Router);
    let accounts = auth.instance.getAllAccounts();
    let user = accounts[0];
    if (user.tenantId.length > 0) return true;
    //if (auth.hasAnyRole(roles)) return true;
    router.navigate(['/404']);
    return false;
};