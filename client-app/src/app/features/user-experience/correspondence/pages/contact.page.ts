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
  InterestOption 
} from '../../~common/apis/correspondence.api';
import { SocialPluginComponent } from '../../~common/components/social-plugin/social-plugin.component';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SocialPluginComponent],
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ContactPage  extends BasePageComponent {
  override pageName = 'vsa-page';
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CorrespondenceApi);
  private readonly notifications = inject(CoreNotificationsService);

  readonly interestOptions = INTEREST_OPTIONS;

  // Local UI state (signals)
  readonly submitting = signal(false);
  readonly serverMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  readonly serverSuccess = signal<boolean>(false);

  // FORM DEFINITION
  form = this.fb.group({
    GivenName: this.fb.nonNullable.control<string>('', { validators: [Validators.required, this.stringValidator()] }),
    Surname: this.fb.nonNullable.control<string>('', { validators: [Validators.required, this.stringValidator()] }),
    Email: this.fb.nonNullable.control<string>('', { validators: [Validators.required, Validators.email] }),
    Phone: this.fb.nonNullable.control<string>('', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(20)] }),
    Message: this.fb.nonNullable.control<string>('', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(4000)] }),
    Interest: new FormControl<InterestOption | null>(null, { validators: [Validators.required] }),
    honeypot: this.fb.control<string>('') // spam trap
  });

  // Search input for InterestTopic
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

    const { GivenName, Surname, Email, Phone, Interest, Message } = this.form.getRawValue();
    // Defensive checks to satisfy TS and runtime
    if (!this.isInterest(Interest)) {
      this.serverMessage.set({ type: 'error', text: 'Invalid selection. Please try again.' });
      this.notifications.showError('Error - Contact form', this.serverMessage()?.text ?? 'Invalid selection. Please try again.');
      return;
    }

    // Create payload
    const payload: CorrespondenceDto = {
      CorrespondenceType: "Request-For-Information",
      ApplicationName: "VSA Prep",

      GivenName: this.form.value.GivenName!.trim(),
      Surname: this.form.value.Surname!.trim(),
      Email: this.form.value.Email!.trim().toLowerCase(),
      Phone: this.form.value.Phone!.trim(),
      Interest: this.form.value.Interest!.trim(),
      Message: this.form.value.Message!.trim(),

      Honeypot: this.form.value.honeypot!.trim()
    };

    this.submitting.set(true);

    this.svc.createContact(payload).subscribe({
      next: (res => {
        this.serverMessage.set({ type: 'success', text: 'Thanks! We will get back to you ASAP.' });
        this.notifications.showSuccess('Success - Contact form', this.serverMessage()?.text ?? 'Thanks for contacting us! We will get back to you ASAP.');
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
        this.notifications.showError('Error - Contact form', this.serverMessage()?.text ?? 'Sorry, something went wrong. Please try again.');
      })
    });
  }
  resetForm(): void {
    this.form.reset({
      GivenName: '',
      Surname: '',
      Email: '',
      Phone: '',
      Message: '',
      Interest: null,
      honeypot: ''
    });
    this.interestSearch.setValue('');
  }

  // Template helpers
  get f() { return this.form.controls; }
  getInputValue(ev: Event): string {
    const el = ev.target as HTMLInputElement | null;
    return el?.value ?? '';
  }
  
}
