import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

/** A hero's name can't match the given regular expression */
export function forbiddenValueValidator(nameRe: RegExp): ValidatorFn {
  return (controlToCompare: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(controlToCompare.value);
    return forbidden ? { forbiddenValue: { value: controlToCompare.value } } : null;
  };
}

@Directive({
  selector: '[appForbiddenValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ForbiddenValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class ForbiddenValidatorDirective implements Validator {
  @Input('appForbiddenValue') forbiddenValue = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenValue
      ? forbiddenValueValidator(new RegExp(this.forbiddenValue, 'i'))(control)
      : null;
  }
}
