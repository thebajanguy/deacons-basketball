import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalService, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';

import { IdentityService } from './~common/services/identity.service';
import { ProfileService } from './~common/services/profile.service';
import { EnsureModuleLoadedOnceGuard } from '../../core/guards/ensure-module-loaded-once.guard';
import { MSALInstanceFactory, MSALGuardConfigFactory, MSALInterceptorConfigFactory } from './~common/configurations/msal.configuration';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ProfileService, 
    IdentityService,

    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,

  ]
})
export class IdentityManagementModule extends EnsureModuleLoadedOnceGuard {    // Ensure that Module is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: IdentityManagementModule) {
    super(parentModule);
  }
}
