import { Directive } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const comparerRevealedValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const fieldOriginal = control.get('firstName');
  const fieldCompare = control.get('lastName');

  return fieldOriginal && fieldCompare && fieldOriginal.value === fieldCompare.value
    ? { identityRevealed: true }
    : null;
};

@Directive({
  selector: '[appComparisonRevealed]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ComparerRevealedValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class ComparerRevealedValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return comparerRevealedValidator(control);
  }
}
