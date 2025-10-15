// Angular 18+ common validators (standalone-friendly)
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

type ReqOpt = { required?: boolean };
type LenOpts = ReqOpt & { min?: number; max?: number };

/**
 * Utility: normalize to trimmed string
 */
function valToString(control: AbstractControl): string {
  return String(control.value ?? '').trim();
}

/**
 * Utility: handle required/optional behavior consistently
 * Returns:
 *  - { required: true } if required and empty
 *  - null if optional and empty
 *  - undefined if a non-empty value should be further validated
 */
function requiredGate(value: string, required?: boolean): ValidationErrors | null | undefined {
  if (!value) {
    return required ? { required: true } : null;
  }
  return undefined; // proceed to specific checks
}

/**
 * Unicode letters + spaces/periods/apostrophes/hyphens, min length 2 when provided.
 * Example: John, O’Neal, Anne-Marie
 */
export function stringValidator(opts: ReqOpt = { required: true }): ValidatorFn {
  const rx = /^[\p{L} .'-]{2,}$/u;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = valToString(control);
    const gate = requiredGate(value, opts.required);
    if (gate !== undefined) return gate;

    return rx.test(value) ? null : { name: true };
  };
}

/**
 * Phone number:
 *  - Allows optional +, digits, spaces, dashes, parentheses
 *  - Total length 7–20 characters (common practical range)
 */
export function phoneNumberValidator(opts: ReqOpt = { required: true }): ValidatorFn {
  const rx = /^\+?[0-9\s\-()]{7,20}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = valToString(control);
    const gate = requiredGate(value, opts.required);
    if (gate !== undefined) return gate;

    return rx.test(value) ? null : { phone: true };
  };
}

/**
 * ISO date validator that checks both format (YYYY-MM-DD) and real calendar date (leap years, days per month).
 * NOTE: returns string messages for clarity; access as errors['isoDate'] in templates.
 */
export function isoDateValidator(opts: ReqOpt = { required: true }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = valToString(control);
    const gate = requiredGate(v, opts.required);
    if (gate !== undefined) return gate;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return { isoDate: 'Use YYYY-MM-DD' };

    const [y, m, d] = v.split('-').map(Number);
    if (m < 1 || m > 12) return { isoDate: 'Invalid month' };
    const daysInMonth = new Date(y, m, 0).getDate(); // last day of month m
    if (d < 1 || d > daysInMonth) return { isoDate: 'Invalid day' };

    return null;
  };
}

/**
 * Digits-only validator with configurable length.
 * - Accepts only 0–9
 * - Optional field by default; if provided, must be between min/max length (inclusive)
 */
export function digitsOnlyValidator(opts: LenOpts = { required: true, min: 1 }): ValidatorFn {
  const min = opts.min ?? 1;
  const max = opts.max ?? Number.POSITIVE_INFINITY;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = valToString(control);
    const gate = requiredGate(value, opts.required);
    if (gate !== undefined) return gate;

    if (!/^\d+$/.test(value)) return { digits: true };
    if (value.length < min) return { minlength: { requiredLength: min, actualLength: value.length } };
    if (value.length > max) return { maxlength: { requiredLength: max, actualLength: value.length } };

    return null;
  };
}

export function alphaNumValidator(opts: ReqOpt = { required: true }): ValidatorFn {
  const re = /^[A-Za-z0-9]+$/; // tweak as needed

  return (control: AbstractControl): ValidationErrors | null => {
    const value = valToString(control);
    const gate = requiredGate(value, opts.required);
    if (gate !== undefined) return gate;

    return re.test(value) ? null : { name: true };
  };
}

/**
 * Validates that a control's value is one of the allowed options.
 * Works for enums, arrays of strings, or typed option arrays.
 *
 * @param allowedOptions Array of allowed values (e.g., ['Basketball', 'Soccer'])
 * @param required Whether the value is mandatory or optional (default: true)
 * @param errorKey Optional error key (default: 'option')
 */
export function isOptionValidator<T>(
  allowedOptions: readonly T[],
  required: boolean = true,
  errorKey: string = 'option'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Empty value handling
    if (value == null || value === '') {
      return required ? { required: true } : null;
    }

    // Check if the value exists in the allowed options
    const isValid = allowedOptions.includes(value as T);

    return isValid ? null : { [errorKey]: true };
  };
}

