import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { UniqueComparisonService } from './unique-comparison.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueComparisonValidator implements AsyncValidator {
  constructor(private comparisonService: UniqueComparisonService) {}

  validate(controlToCompare: AbstractControl): Observable<ValidationErrors | null> {
    return this.comparisonService.isValueAlreadyTaken(controlToCompare.value).pipe(
      map((isTaken) => (isTaken ? { uniqueValue: true } : null)),
      catchError(() => of(null)),
    );
  }
}

@Directive({
  selector: '[appUniqueComparison]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => UniqueComparisonValidatorDirective),
      multi: true,
    },
  ],
  standalone: true,
})
export class UniqueComparisonValidatorDirective implements AsyncValidator {

  constructor(private comparer : UniqueComparisonValidator) {}

  validate(controlToCompare: AbstractControl): Observable<ValidationErrors | null> {
    return this.comparer.validate(controlToCompare);
  }
}
