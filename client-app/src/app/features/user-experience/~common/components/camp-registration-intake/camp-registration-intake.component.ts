import { ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  FormGroup,
  ValidationErrors
} from '@angular/forms';
import { 
  map, 
  startWith, 
  catchError, 
  of, 
  finalize, 
  Observable, 
  tap, 
  take, 
  switchMap, 
  shareReplay, 
  distinctUntilChanged,
  BehaviorSubject} from 'rxjs';
import { signal } from '@angular/core';
import { CoreNotificationsService } from '../../../../../core/notifications/notifications.service';
import { ActivityRegistrationApi, ActivityRegistrationDto, BASKETBALL_POSITION_OPTIONS, BasketballPositionOption, COUNTRY_OPTIONS, CountryOption, INTEREST_OPTIONS, InterestOption, SKILL_LEVEL_OPTIONS, SkillLevelOption, SOCCER_POSITION_OPTIONS, TSHIRT_SIZE_OPTIONS, TShirtSizeOption } from '../../apis/registration.api';
import { stringValidator, isoDateValidator, phoneNumberValidator, digitsOnlyValidator, isOptionValidator, alphaNumValidator } from '../../validators/validators';
import { sqlInjectionValidator } from '../../validators/sqlinjection.validators';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Activity, ActivityApi } from '../../apis/activity.api';

@Component({
  selector: 'app-camp-registration-intake-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './camp-registration-intake.component.html',
  styleUrls: ['./camp-registration-intake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CampRegistrationIntakeComponent  {
  private readonly fb = inject(FormBuilder);
  private readonly registrationSvc = inject(ActivityRegistrationApi);
  private readonly activitySvc = inject(ActivityApi);  
  private readonly notifications = inject(CoreNotificationsService);

  @Input() sport: InterestOption = 'Basketball';
  @Input() country: CountryOption = 'Barbados';
  @Input() activity: string= 'basketball-camp'

  activities$!: Observable<Activity[]>;
  readonly interestOptions = INTEREST_OPTIONS;
  readonly countryOptions = COUNTRY_OPTIONS;
  readonly skillOptions = SKILL_LEVEL_OPTIONS;
  readonly sizeOptions = TSHIRT_SIZE_OPTIONS;
  readonly basketballPositionOptions = BASKETBALL_POSITION_OPTIONS;
  readonly soccerPositionOptions = SOCCER_POSITION_OPTIONS;

  // Local UI state (signals)
  readonly submitting = signal(false);
  readonly serverMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  readonly serverSuccess = signal<boolean>(false);
  readonly errorMsg = signal<string | null>(null);

  // FORM DEFINITION
  form = this.fb.group({
    honeypot:   this.fb.control<string>(''), // spam trap

    Country:    new FormControl<CountryOption | null>(null, { validators: [isOptionValidator(this.countryOptions, true, 'country')] }),
    Interest:   new FormControl<InterestOption | null>(null, { validators: [isOptionValidator(this.interestOptions, true, 'interest')] }),

    ActivityId:  this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),

    Givenname:  this.fb.nonNullable.control<string>('', { validators: [stringValidator({ required: true })] }),
    Surname:    this.fb.nonNullable.control<string>('', { validators: [stringValidator({ required: true })] }),
    DOB:        this.fb.nonNullable.control<string>('', { validators: [isoDateValidator({ required: true })] }),

    Email:      this.fb.nonNullable.control<string>('', { validators: [Validators.email] }),
    Phone:      this.fb.nonNullable.control<string>('', { validators: [phoneNumberValidator({ required: false })] }),
    
    School:     this.fb.nonNullable.control<string>('', { validators: [stringValidator({ required: true })] }),
    GradeOrForm:this.fb.nonNullable.control<string>('', { validators: [alphaNumValidator({ required: true })] }),

    Position:   new FormControl<BasketballPositionOption | null>(null, { validators:[isOptionValidator(this.basketballPositionOptions, true, 'position')] }),
    SkillLevel: new FormControl<SkillLevelOption | null>(null, { validators:[isOptionValidator(this.skillOptions, true, 'skill')] }),
    TshirtSize: new FormControl<TShirtSizeOption | null>(null, { validators:[isOptionValidator(this.sizeOptions, true, 'size')]}),

    GuardianName:     this.fb.nonNullable.control<string>('', { validators: [Validators.required, stringValidator({ required: true })] }),
    GuardianEmail:    this.fb.nonNullable.control<string>('', { validators: [Validators.required, Validators.email] }),
    GuardianPhone:    this.fb.nonNullable.control<string>('', { validators: [Validators.required, phoneNumberValidator({ required: true })] }),
    GuardianRelation: this.fb.nonNullable.control<string>('', { validators: [Validators.required, stringValidator({ required: true })] }),
    /*
    PaymentMethod:     this.fb.nonNullable.control<string>('', { validators: [Validators.required, this.stringValidator()] }),
    PaymentAmount:    this.fb.nonNullable.control<number | null>(null, { validators: [Validators.required, ] }),
    PaymentCurrency:    this.fb.nonNullable.control<string>('', { validators: [Validators.required, this.stringValidator()] }),
    */
    Notes:      this.fb.nonNullable.control<string>('', { validators: [sqlInjectionValidator({ required: false, mode: 'relaxed' }), stringValidator({ required: false }), Validators.maxLength(4000)] })
    
  });

  // Search input for InterestTopic
  readonly interestSearch = this.fb.control<string>('', { nonNullable: true } );
  // Filtered options (also used to populate the Interest Options <datalist>)
  readonly filteredInterest$ = this.interestSearch.valueChanges.pipe(
    startWith(''),
    map(term => (term ?? '').toLowerCase()),
    map(term => this.interestOptions.filter(t => t.toLowerCase().includes(term)))
  );

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const lc = (s?: string | null) => (s ?? '').trim().toLowerCase();

    const qp$ = this.route.queryParamMap.pipe(
      map(qp => ({
        idIn: qp.get('id') ?? '',
        sportIn: qp.get('sport') ?? '',
        countryIn: qp.get('country') ?? '',
        activityIn: qp.get('activity') ?? '',
      })),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  
    // 1) Set this.activity once from query param (fallback to @Input default)
    qp$.pipe(
      map(({ activityIn }) => activityIn?.trim().toLowerCase()),
      map(a => lc(a) || lc(this.activity)),
      distinctUntilChanged(),
      take(1)
    ).subscribe(a => this.activity = lc(a));
  
    // 2) Sport from qp OR existing form value OR component fallback
    const sport$ = qp$.pipe(
      map(({ sportIn }) => {
        const q = lc(sportIn);
        const match = this.interestOptions?.find(i => lc(i) === q);
        return match || this.form.value.Interest || this.sport;
      }),
      tap(s => this.form.patchValue({ Interest: s })),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  
    // 3) Country from qp OR existing form value OR component fallback
    const country$ = qp$.pipe(
      map(({ countryIn }) => {
        const q = lc(countryIn);
        const match = this.countryOptions?.find(c => lc(c) === q);
        return match || this.form.value.Country || this.country;
      }),
      tap(c => this.form.patchValue({ Country: c })),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  
    // 4) Camps based on sport + country
    this.activities$ = combineLatest([sport$, country$]).pipe(
      switchMap(([sport, country]) =>
        this.activitySvc.getCamps$(lc(sport), lc(country))
      ),
      map(camps => camps.slice().sort(
        (a, b) => +new Date(a.dates.start) - +new Date(b.dates.start)
      )),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  
    // 5) Set ActivityId once (prefer id from query if present in list)
    combineLatest([qp$, this.activities$]).pipe(take(1)).subscribe(([{ idIn }, list]) => {
      if (!list?.length) return;
      const preferred = idIn && list.find(c => c.id === idIn)?.id;
      const nextId = preferred || list[0].id;
      if (!this.form.controls['ActivityId'].value) {
        this.form.patchValue({ ActivityId: nextId });
      }
    });
  }
  

  // FORM ACTIONS AND HELPERS
  // --- Submit ---
  onSubmit(): void {
    this.serverMessage.set(null);
    this.serverSuccess.set(false);

    if (this.form.value.honeypot) return; // bot caught

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    // To do: Uncomment if need to extract the phone digits only
    // const cleanPhonePlayer = extractPhoneDigitsOnly(v.Phone);
    // Create payload
    const payload: ActivityRegistrationDto = {
      RegistrationType: this.activity.trim().toLocaleLowerCase(),
      ApplicationName: "VSA Prep",

      Country: v.Country!.trim(), Interest: v.Interest!.trim(), ActivityId: v.ActivityId!.trim(),
      Player: {
        Givenname: v.Givenname!.trim(), Surname: v.Surname!.trim(),  DOB: v.DOB!.trim(),        
        Email: v.Email!.trim().toLowerCase() ?? null, Phone: v.Phone!.trim() ?? null,
        School: v.School!.trim(), GradeOrForm: v.GradeOrForm,
        Position: v.Position!.trim(), SkillLevel: v.SkillLevel!.trim(), TshirtSize: v.TshirtSize!.trim()
      },
      Guardian: {
        GuardianName: v.GuardianName, 
        GuardianEmail: v.GuardianEmail!.trim().toLocaleLowerCase(), GuardianPhone: v.GuardianPhone!.trim(),
        GuardianRelation: v.GuardianRelation!.trim()
      },
      /*
      Payment: {
        PaymentAmount: v.PaymentAmount!.trim(), 
        PaymentCurrency: v.PaymentCurrency!.trim(), 
        PaymentMethod: v.PaymentMethod!.trim(), 
        //PaymentStatus: null, 
        //PaymentTransactionId: null, 
      }
      */
      Notes: v.Notes!.trim() ?? null,
      CreatedAt: new Date().toISOString(),

      Honeypot: v.honeypot!.trim()
    };

    this.submitting.set(true);

    this.registrationSvc.registerForCamp(payload).subscribe({
      next: (res => {
        this.serverMessage.set({ type: 'success', text: 'Thanks for registering! We will get back to you ASAP.' });
        this.notifications.showSuccess('Success - Registration form', this.serverMessage()?.text ?? '' );
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
        this.notifications.showError('Error - Registration form', this.serverMessage()?.text ?? 'Sorry, something went wrong. Please try again.');
      })
    });

  }
  // --- Reset and reapply QPs + reload camps ---
  resetForm(): void {
    // 1) Reset
    this.form.reset({
      Country: null,
      Interest: null,
      ActivityId: '',
      Givenname: '',
      Surname: '',
      DOB: '',
      Email: '',
      Phone: '',
      Notes: '',
      honeypot: ''
    });
    this.interestSearch.setValue('');

    // 2) Reapply query params if valid
    const qp = this.route.snapshot.queryParamMap;
    const countryIn = qp.get('country');
    const sportIn = qp.get('sport');

    if (countryIn && this.countryOptions.includes(countryIn as CountryOption)) {
      this.form.patchValue({ Country: countryIn as CountryOption });
    }
    if (sportIn && this.interestOptions.includes(sportIn as InterestOption)) {
      this.form.patchValue({ Interest: sportIn as InterestOption });
    }

    // 3) Reload camps (and auto-pick first if none)
    this.reloadCamps();
  }

  // --- Helper: reload camps based on current form (or fallbacks) ---
  private reloadCamps(): void {
    const sport = (this.form.value?.Interest ?? this.sport ?? '').toString().trim().toLowerCase();
    const country = (this.form.value?.Country ?? this.country ?? '').toString().trim().toLowerCase();

    this.activities$ = this.activitySvc
      .getCamps$(sport, country)
      .pipe(
        map(camps =>
          camps.slice().sort((a, b) => +new Date(a.dates.start) - +new Date(b.dates.start))
        )
      );

    // Set default ActivityId to first option if empty
    this.activities$.pipe(take(1)).subscribe(list => {
      const current = this.form.controls['ActivityId'].value;
      if (list?.length && !current) {
        this.form.patchValue({ ActivityId: list[0].id });
      }
    });
  }

  // --- Activity Dropdown handlers ---
  trackById = (_: number, c: Activity) => c.id;

  // Template helpers
  get f() { return this.form.controls; } // Full Form Template
  getInputValue(ev: Event): string {
      const el = ev.target as HTMLInputElement | null;
      return el?.value ?? '';
  }
  
}
