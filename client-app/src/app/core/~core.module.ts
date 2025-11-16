import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  importProvidersFrom} from '@angular/core';
import { EnsureModuleLoadedOnceGuard } from './guards/ensure-module-loaded-once.guard';
import { CoreInterceptorsModule } from './interceptors/~interceptors.module';
import { CoreNotificationsModule } from './notifications/~notifications.module';



@NgModule({
  declarations: [],
  imports: [CommonModule, CoreNotificationsModule],// CoreInterceptorsModule],
  providers: [
    importProvidersFrom()
  ]
})
export class CoreApplicationModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule
  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreApplicationModule) {
    super(parentModule);
  }
}
