import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//
import { EnsureModuleLoadedOnceGuard } from '../guards/ensure-module-loaded-once.guard';
import { environment } from '../../../environments/environment';
import { HttpErrorInterceptor } from './httperror.interceptor';

@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useValue: HttpErrorInterceptor, multi: true }, 
  ]
})
export class CoreInterceptorsModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule
  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreInterceptorsModule) {
    super(parentModule);
  }
}