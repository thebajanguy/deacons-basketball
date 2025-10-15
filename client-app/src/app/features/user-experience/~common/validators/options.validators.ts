import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

type ReqOpt = { required?: boolean };

export interface OptionValidatorOpts<T, V = unknown> extends ReqOpt {
  /** If true, the control's value is an array (multi-select) */
  multi?: boolean;
  /** Extract comparable value from an option item (defaults: identity for primitives; `o.value ?? o.id ?? o.key`) */
  optionValue?: (opt: T) => V;
  /** Extract comparable value from the control value (defaults: identity for primitives; `v.value ?? v.id ?? v.key`) */
  controlValue?: (value: unknown) => V | V[];
  /** Equality comparer (default: strict `===`) */
  equals?: (a: V, b: V) => boolean;
  /** Error key to emit when invalid */
  errorKey?: string;
  /** For multi selects, enforce a minimum/maximum number of selections */
  minSelected?: number;
  maxSelected?: number;
}

/** Internal: normalize empty */
function isEmpty(val: unknown): boolean {
  return val == null || val === '' || (Array.isArray(val) && val.length === 0);
}

/** Internal: default primitive-or-common-object value extractor */
function defaultValueOf(x: any): any {
  if (x && typeof x === 'object') {
    if ('value' in x) return x.value;
    if ('id' in x) return x.id;
    if ('key' in x) return x.key;
  }
  return x;
}

/**
 * Validate that a control's value(s) is among allowed options.
 * Works with primitives or objects, single or multi-select.
 */
export function isOptionValidator<T, V = unknown>(
  allowedOptions: readonly T[],
  opts: OptionValidatorOpts<T, V> = { required: true }
): ValidatorFn {
  const {
    required = true,
    multi = false,
    optionValue = defaultValueOf as (opt: T) => V,
    controlValue = defaultValueOf as (val: unknown) => V | V[],
    equals = (a: V, b: V) => a === b,
    errorKey = 'option',
    minSelected,
    maxSelected,
  } = opts;

  // Precompute comparable values of allowed options
  const allowedValues = allowedOptions.map(optionValue);

  // Fast path if all allowedValues are primitive & equality is strict
  const canUseSet = allowedValues.every(
    v => ['string', 'number', 'boolean'].includes(typeof v) || v === null
  ) && equals === ((a: V, b: V) => a === b);
  const allowedSet = canUseSet ? new Set(allowedValues as unknown as (string|number|boolean|null)[]) : null;

  const inAllowed = (val: V): boolean => {
    if (allowedSet) return allowedSet.has(val as any);
    return allowedValues.some(av => equals(av, val));
  };

  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;

    // Required/optional gate
    if (isEmpty(raw)) {
      return required ? { required: true } : null;
    }

    // Extract comparable values from control
    const normalized = controlValue(raw);

    if (!multi) {
      const cv = normalized as V;
      return inAllowed(cv) ? null : { [errorKey]: true };
    }

    // Multi-select
    const arr = Array.isArray(normalized) ? normalized as V[] : [normalized as V];

    // Enforce min/max
    if (typeof minSelected === 'number' && arr.length < minSelected) {
      return { minSelected: { required: minSelected, actual: arr.length } };
    }
    if (typeof maxSelected === 'number' && arr.length > maxSelected) {
      return { maxSelected: { required: maxSelected, actual: arr.length } };
    }

    // Every selected must be in allowed
    const allValid = arr.every(v => inAllowed(v));
    return allValid ? null : { [errorKey]: true };
  };
}

/* EXAMPLE USAGE */
/* Option-1 Native <select> with object options, control holds object
type Country = { id: string; name: string };

countries: Country[] = [
  { id: 'BB', name: 'Barbados' },
  { id: 'US', name: 'United States' },
  { id: 'CA', name: 'Canada' },
];

form = this.fb.group({
  country: [null, [
    isOptionValidator<Country, string>(this.countries, {
      required: true,
      optionValue: o => o.id,       // compare by option.id
      controlValue: v => (v as any)?.id ?? v, // compare by controlValue.id if object
    })
  ]]
});

<select formControlName="country">
  <option [ngValue]="null">Select country</option>
  <option *ngFor="let c of countries" [ngValue]="c">{{ c.name }}</option>
</select>
*/

/* Option-2 ng-select or mat-select bound to primitive via bindValue
// Options as objects, but control stores the primitive `value`
type InterestOption = { label: string; value: string };

interestOptions: InterestOption[] = [
  { label: 'Basketball', value: 'basketball' },
  { label: 'Soccer',     value: 'soccer'     },
  { label: 'Track',      value: 'track'      },
];

form = this.fb.group({
  interest: ['', [
    isOptionValidator<InterestOption, string>(this.interestOptions, {
      required: true,
      optionValue: o => o.value,   // allowed values derived from option.value
      controlValue: v => v as string, // control already holds primitive
      errorKey: 'interest'
    })
  ]]
});

<!-- ng-select example -->
<ng-select
  [items]="interestOptions"
  bindLabel="label"
  bindValue="value"
  formControlName="interest"
  placeholder="Select interest">
</ng-select>
  
*/

/* Option-3 Multi-select with min/max
form = this.fb.group({
  sports: [[], [
    isOptionValidator<InterestOption, string>(this.interestOptions, {
      required: false,
      multi: true,
      optionValue: o => o.value,
      // control holds array of primitives from bindValue="value"
      controlValue: v => Array.isArray(v) ? v as string[] : [v as string],
      minSelected: 1,
      maxSelected: 3,
      errorKey: 'interest'
    })
  ]]
});


*/

/* Option 4) Strict deep equality (when control holds the whole object)
form = this.fb.group({
  countryObj: [null, [
    isOptionValidator<Country, Country>(this.countries, {
      required: true,
      optionValue: o => o,     // keep the object itself
      controlValue: v => v as Country,
      equals: (a, b) => a?.id === b?.id // compare by id (deep-ish)
    })
  ]]
});

*/