import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { inject } from '@angular/core';
import { CoreNotificationsService } from '../notifications/notifications.service';

import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  notificationService = inject(CoreNotificationsService);
  
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        //let errorMessage = 'An unknown error occurred!';
        let errorMessage = '';
        let errorTitle = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorTitle = 'Client-side error:';
          errorMessage = `${error.status} ${error.error.message}`;
        } else {
          // Server-side error
          errorTitle = 'Server-side error:';
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        // Display user-friendly message
        this.notificationService.showError(errorTitle, errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
