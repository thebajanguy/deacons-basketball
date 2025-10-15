import { Injectable, Injector, Inject, Optional, InjectionToken } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, of, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { v4 as uuidv4, NIL as NIL_UUID } from 'uuid';
//
import { IpServiceService } from './ip-service.service';
import { environment } from '../../../environments/environment';

type SingleUserProfileResponse = {
  data?: any
};


@Injectable({ providedIn: 'root'})
export class UtilitiesService  {

  private _location: Location;
  private _httpClient: HttpClient;

  constructor(private ip: IpServiceService, httpClient: HttpClient, location: Location  ) {
      this._location = location;
      this._httpClient = httpClient;
  }

  public get DefaultLanguage(): string {
    let defaultLanguage = environment.appSettings.defaultLanguage;
    return defaultLanguage;
  } 
  public get UrlRoutePath(): string {
    let path = environment.appSettings.urlRoutePath;
    let routePath = `${this.DefaultLanguage}/${path}`;
    return routePath;
  } 
  public get LoginRoutePath(): string {
    let path = environment.appSettings.loginRoutePath;
    let routePath = `${this.DefaultLanguage}/${path}`;
    return routePath;
  } 
  public get WorkspaceRoutePath(): string {
    let path = environment.appSettings.workspaceRoutePath;
    let routePath = `${this.DefaultLanguage}/${path}`;
    return routePath;
  } 

  public get ApiBaseUrl(): string {
    debugger;

    if(this.BaseUrl.includes('localhost')){
      return 'http://localhost:7071';
    }

    return '';
  }
  public get BaseUrl(): string {
    debugger;
    /*
    console.log('window.location.origin:  ' + window.location.origin);
    console.log('window.location.href:  ' + window.location.href);
    //console.log('window.location.hostname:  ' + window.location.hostname);
    //console.log('window.location.pathname:  ' + window.location.pathname);

    alert('window.location.origin:  ' + window.location.origin);
    alert('window.location.href:  ' + window.location.href);
    //alert('window.location.hostname:  ' + window.location.hostname);
    //alert('window.location.pathname:  ' + window.location.pathname);
    */
    return window.location.origin;
  }
  public get HrefPath(): string {
    return window.location.href;
  }
  public get ApplicationName(): string {
    return environment.appSettings.applicationName;
  }
  public get UserStorageKey(): string {
    return environment.appSettings.localUserStorageKey;
  }
  public get UserTokenKey(): string {
    return environment.appSettings.userTokenKey;
  }
  public get CreateGuid(): string {
    let id = uuidv4();
    return id;
  }
  public get CreateNilGuid(): string {
    let id = NIL_UUID;
    return id;
  }
  public GetIP()
  {
    this.ip.getIPAddress().subscribe((res:any)=>{
    let ipAddress=res.ip;
    return ipAddress;
    });
  }


  /*********** ERROR HANDLING **************************************/
  public handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
    // Client-side errors
    errorMessage = `Error: ${error.error.message}`;
    } else {
    // Server-side errors
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => new Error(errorMessage)) ;
  }

}
