import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoggingService } from '../services/logging.service';


@Injectable({providedIn: 'root'})
export class CoreNotificationsService {

  constructor( private toastrService: ToastrService, private loggerService: LoggingService) {}
  
  /**
  * Displays a Success Toast message.
  *
  * @param {string} title - The title to display.
  * @param {string} message - The message to display.
  */
  public showSuccess(title: string, message: string) {
    this.toastrService.success(message, title)
    .onTap
    .subscribe(() => this.toasterClickedHandler());
    this.loggerService.success(title,message);
  }

  /**
  * Displays an Error Toast message.
  *
  * @param {string} title - The title to display.
  * @param {string} message - The message to display.
  */
  public showError(title: string, message: string) {
    this.toastrService.error(message, title)
    .onTap
    .subscribe(() => this.toasterClickedHandler());
    this.loggerService.error(title, message);
  }

  /**
  * Displays a Warning Toast message.
  *
  * @param {string} title - The title to display.
  * @param {string} message - The message to display.
  */
  public showWarning(title: string, message: string) {
    this.toastrService.warning(message, title)
    .onTap
    .subscribe(() => this.toasterClickedHandler());
    this.loggerService.warn(title,message);
  }

  /**
  * Displays an Information Toast message.
  *
  * @param {string} title - The title to display.
  * @param {string} message - The message to display.
  */
  public showInfo(title: string, message: string, config:any) {
    this.toastrService.info(message, title, config)
    .onTap
    .subscribe(() => this.toasterClickedHandler());
    this.loggerService.info(title,message);
  }

  toasterClickedHandler() {
    return;
    //this.loggerService.info('', 'Toastr clicked');
  }

}
