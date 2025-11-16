import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LoggingService {
  currentDate: Date = new Date();


  constructor() {}
  
  /** Log a Service message with the MessageService */
  public info(title: string, message: string) {
    if (!environment.production) {
      let log = `@Deacons Basketball Club@1.0.0 : Verbose | Info : [${this.currentDate}] : ${title} - ${message}`;
      console.info(`${log}`);
    }
    else {
      // TODO: send the error to remote logging infrastructure
    }
  }

  public error(title: string, message: string) {
    if (!environment.production) {
      let log = `@Deacons Basketball Club@1.0.0 : Verbose | Error : [${this.currentDate}] : ${title} - ${message}`;
      console.error(`${log}`);
    }
    else {
      // TODO: send the error to remote logging infrastructure
    }
  }

  public success(title: string, message: string) {
    if (!environment.production) {
      let log = `@Deacons Basketball Club@1.0.0 : Verbose | Success : [${this.currentDate}] : ${title} - ${message}`;
      console.log(`${log}`);
    }
    else {
      // TODO: send the error to remote logging infrastructure
    }
  }

  public warn(title: string, message: string) {
    if (!environment.production) {
      let log = `@Deacons Basketball Club@1.0.0 : Verbose | Warn : [${this.currentDate}] : ${title} - ${message}`;
      console.warn(`${log}`);
    }
    else {
      // TODO: send the error to remote logging infrastructure
    }
  }
  
}
