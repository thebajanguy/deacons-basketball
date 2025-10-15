import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
  FormBuilder,
  ValidatorFn
} from '@angular/forms';
import { map, startWith, catchError, of, finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';

import { CoreNotificationsService } from '../../../../core/notifications/notifications.service';
import { 
  CorrespondenceApi, 
  CorrespondenceDto, 
  INTEREST_OPTIONS, 
  COUNTRY_OPTIONS,
  InterestOption,
  CountryOption
} from '../../~common/apis/correspondence.api';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './newsletter.page.html',
  styleUrls: ['./newsletter.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NewsletterPage  extends BasePageComponent {
  override pageName = 'vsa-page';
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CorrespondenceApi);
  private readonly notifications = inject(CoreNotificationsService);

  readonly interestOptions = INTEREST_OPTIONS;
  readonly countryOptions = COUNTRY_OPTIONS;

  // Local UI state (signals)
  readonly submitting = signal(false);
  readonly serverMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  readonly serverSuccess = signal<boolean>(false);

  // FORM DEFINITION
  form = this.fb.group({
    Fullname: this.fb.nonNullable.control<string>('', { validators: [Validators.required, this.stringValidator()] }),
    Email: this.fb.nonNullable.control<string>('', { validators: [Validators.required, Validators.email] }),
    Interest: new FormControl<InterestOption | null>(null, { validators: [Validators.required] }),
    Country: new FormControl<CountryOption | null>(null, { validators: [Validators.required] }),
    honeypot: this.fb.control<string>('') // spam trap
  });

  // Search input for Interest
  readonly interestSearch = this.fb.control<string>(
    '', 
    { nonNullable: true }
  );
  // Filtered options (also used to populate the Interest Options <datalist>)
  readonly filteredInterest$ = this.interestSearch.valueChanges.pipe(
    startWith(''),
    map(term => (term ?? '').toLowerCase()),
    map(term => this.interestOptions.filter(t => t.toLowerCase().includes(term)))
  );

  // Search input for Country
  readonly countrySearch = this.fb.control<string>(
    '', 
    { nonNullable: true }
  );
  // Filtered options (also used to populate the Country Options <datalist>)
  readonly filteredCountry$ = this.countrySearch.valueChanges.pipe(
    startWith(''),
    map(term => (term ?? '').toLowerCase()),
    map(term => this.countryOptions.filter(t => t.toLowerCase().includes(term)))
  );

  // --- Validators / guards ---
  private stringValidator(): ValidatorFn {
    // Unicode letters + space/.'- , min length 2
    const rx = /^[\p{L} .'-]{2,}$/u;
    return (c: AbstractControl) =>
      !c.value ? { required: true } : rx.test(String(c.value).trim()) ? null : { name: true };
  }
  private isInterest(v: unknown): v is InterestOption {
    return this.interestOptions.includes(v as InterestOption);
  }
  private isCountry(v: unknown): v is CountryOption {
    return this.countryOptions.includes(v as CountryOption);
  }

  // --- Interest Dropdown handlers ---
  onInterestInputChange(value: string): void {
    // If the typed value matches a valid option, lock it into the form.
    const match = this.interestOptions.find((o: string) => o.toLowerCase() === value.trim().toLowerCase());
    if (match) {
      this.form.controls.Interest.setValue(match);
      this.interestSearch.setValue(match, { emitEvent: false });
    } else {
      // If not a valid option, keep the search but clear the form value
      this.form.controls.Interest.setValue(null);
    }
  }
  selectInterest(interest: InterestOption): void {
    this.form.controls.Interest.setValue(interest);
    this.interestSearch.setValue(interest, { emitEvent: false });
  }
  clearInterest(): void {
    this.form.controls.Interest.setValue(null);
    this.interestSearch.setValue('');
  }

  // --- Country Dropdown handlers ---
  onCountryInputChange(value: string): void {
    // If the typed value matches a valid option, lock it into the form.  
    const match = this.countryOptions.find((o: string) => o.toLowerCase() === value.trim().toLowerCase());
    if (match) {
      this.form.controls.Country.setValue(match);
      this.countrySearch.setValue(match, { emitEvent: false });
    } else {
      // If not a valid option, keep the search but clear the form value
      this.form.controls.Country.setValue(null);
    }
  }
  selectCountry(country: CountryOption): void {
    this.form.controls.Country.setValue(country);
    this.countrySearch.setValue(country, { emitEvent: false });
  }
  clearCountry(): void {
    this.form.controls.Country.setValue(null);
    this.countrySearch.setValue('');
  }

  // FORM ACTIONS
  // --- Submit ---
  submit(): void {
    this.serverMessage.set(null);
    this.serverSuccess.set(false);

    if (this.form.value.honeypot) return; // bot caught

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { Fullname, Email, Country, Interest } = this.form.getRawValue();
    // Defensive checks to satisfy TS and runtime
    if (!this.isInterest(Interest)) {
      this.serverMessage.set({ type: 'error', text: 'Invalid selection. Please try again.' });
      this.notifications.showError('Error - Contact form', this.serverMessage()?.text ?? 'Invalid selection. Please try again.');
      return;
    }
    if (!this.isCountry(Country)) {
      this.serverMessage.set({ type: 'error', text: 'Invalid selection. Please try again.' });
      this.notifications.showError('Error - Contact form', this.serverMessage()?.text ?? 'Invalid selection. Please try again.');
      return;
    }

    // Create payload
    const payload: CorrespondenceDto = {
      CorrespondenceType: "Request-For-Newsletter",
      ApplicationName: "VSA Prep",

      Fullname: this.form.value.Fullname!.trim(),
      Email: this.form.value.Email!.trim().toLowerCase(),
      Interest: this.form.value.Interest!.trim(),
      Country: this.form.value.Country!.trim(),

      Honeypot: this.form.value.honeypot!.trim()
    };

    this.submitting.set(true);

    this.svc.createNewsletter(payload).subscribe({
      next: (res => {
        this.serverMessage.set({ type: 'success', text: 'Thanks! We will get back to you ASAP.' });
        this.notifications.showSuccess('Success - Newsletter form', this.serverMessage()?.text ?? 'Thanks for contacting us! We will get back to you ASAP.');
        console.log('OK', res);
        this.resetForm();
        this.serverSuccess.set(true);
        this.submitting.set(false);
      }),
      error: (err => {
        console.error('ERR', err);
        this.serverSuccess.set(false);
        this.submitting.set(false);
        this.serverMessage.set({ type: 'error', text: err?.error?.message ?? 'Sorry, something went wrong. Please try again.' });
        this.notifications.showError('Error - Newsletter form', this.serverMessage()?.text ?? 'Sorry, something went wrong. Please try again.');
      })
    });
  }
  resetForm(): void {
    this.form.reset({
      Fullname: '',   // string values
      Email: '',
      Interest: null, // dropdown values
      Country: null,
      honeypot: ''    // spam trap
    });
    this.interestSearch.setValue('');
    this.countrySearch.setValue('');
  }

  // Template helpers
  get f() { return this.form.controls; }
  getInputValue(ev: Event): string {
    const el = ev.target as HTMLInputElement | null;
    return el?.value ?? '';
  }
  
}
