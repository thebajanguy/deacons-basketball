import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';


@Injectable({providedIn: 'root'})
export class ErrorService {

  constructor(
    private loggerService: LoggingService, 
  ) {
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.loggerService.error('ErrorService-handleError', error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.loggerService.info('ErrorService-handleError', `${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
