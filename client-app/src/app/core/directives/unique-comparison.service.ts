import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const UNIQUE_LIST = ['Eric'];

@Injectable({ providedIn: 'root' })
export class UniqueComparisonService {
  isValueAlreadyTaken(valueToCompare: string): Observable<boolean> {
    const isTaken = UNIQUE_LIST.includes(valueToCompare);

    return of(isTaken).pipe(delay(400));
  }
}
