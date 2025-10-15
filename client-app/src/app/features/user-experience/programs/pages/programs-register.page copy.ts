import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../../../core/directives/base-page.directive';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterPage } from '../../correspondence/pages/newsletter.page';
import { BaseHeroComponent } from "../../~common/components/base-hero/base-hero.component";
import { SocialPluginComponent } from "../../~common/components/social-plugin/social-plugin.component";
import { inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Camp, CampsService } from '../../~common/apis/activity.api';
import { RegistrationApi, CampRegistrationPayload, SKILL_LEVEL_OPTIONS, SPORT_OPTIONS, TSHIRT_SIZE_OPTIONS, SportOption } from '../../~common/apis/registration.api';
import { map, Observable, take, tap } from 'rxjs';
import { RegistrationIntakeComponent, CampRegistrationIntakeComponent } from "../../~common/components/camp-registration-intake/camp-registration-intake.component";



@Component({
  selector: 'app-programs-register',
  standalone: true,

  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, ReactiveFormsModule, DatePipe,
    BaseHeroComponent, NewsletterPage, SocialPluginComponent,
    RegistrationIntakeComponent,
    CampRegistrationIntakeComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './programs-register.page.html',
  styleUrl: './programs-register.page.scss',
})
export class ProgramsRegisterPage extends BasePageComponent implements OnInit  {
  private fb: FormBuilder = inject(FormBuilder);
  private reg = inject(RegistrationApi);
  private campsSvc = inject(CampsService);  

  @Input() sport: 'basketball' | 'soccer' | 'other' = 'basketball';
  @Input() cityAndCountry?: string;
  

  override pageName = 'vsa-page';
  description = `
  Academic tutoring, sports performance, and recruiting support—built for Barbadian student-athletes.
  `.trim();  

  camps$!: Observable<Camp[]>;
  submitting = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);

  sportOptions = SPORT_OPTIONS;
  skillOptions = SKILL_LEVEL_OPTIONS;
  sizeOptions = TSHIRT_SIZE_OPTIONS;

  // FORM DEFINITION
  form: FormGroup = this.fb.group({
    campId: this.fb.nonNullable.control<string | null>(null),
    sport: this.fb.nonNullable.control<string | null>(this.sportOptions[0]),
    //sport: new FormControl<SPORT_OPTIONS | null>(null, { validators: [Validators.required] }),

    player: this.fb.group({
      firstName: this.fb.nonNullable.control<string | null>(null),
      lastName: this.fb.nonNullable.control<string | null>(null),
      dob: this.fb.nonNullable.control('', { validators: [this.isoDateValidator] }),
      email: this.fb.nonNullable.control<string | null>(null, { validators: [Validators.email] }),
      phone: this.fb.nonNullable.control<string | null>(null),
      school: this.fb.nonNullable.control<string | null>(null),
      gradeOrForm: this.fb.nonNullable.control<string | null>(null),
      position: this.fb.nonNullable.control<string | null>(null ),
      skillLevel: this.fb.nonNullable.control<string | null>(this.skillOptions[0]),
      tshirtSize: this.fb.nonNullable.control<string | null>(this.sizeOptions[0]),
    }),
    guardian: this.fb.group({
      name: this.fb.nonNullable.control<string | null>(null),
      email: this.fb.nonNullable.control<string | null>(null),
      phone: this.fb.nonNullable.control<string | null>(null),
      relation: this.fb.nonNullable.control<string | null>(null),
    }),
    notes: this.fb.nonNullable.control<string | null>(null),
  });

  override ngOnInit() {
    //this.sport = "basketball";
    //this.cityAndCountry = "Barbados";

    /*
    this.camps$ = this.campsSvc
    .getCamps$(this.sport, this.cityAndCountry)
    .pipe(map(camps => camps.slice().sort(
      (a, b) => +new Date(a.dates.start) - +new Date(b.dates.start)
    )));
  
    this.camps$.subscribe(list => {
      if (list?.length && !this.form.controls['activityId'].value) {
        this.form.controls['activityId'].setValue(list[0].id);
      }
    });
    */

    // If you already have camps$, just add this tap/take(1) chain where it’s defined:
    this.camps$ = this.campsSvc
      .getCamps$(this.sport, this.cityAndCountry)
      .pipe(tap(camps => {
        if (!camps?.length) return;
        const ctrl = this.form.get('campId');
        // Only set if empty/pristine so we don’t overwrite user choice
        if (ctrl && (ctrl.value == null || ctrl.pristine)) {
          ctrl.setValue(this.pickDefaultCampId(camps), { emitEvent: false });
        }
      }),
      take(1) // ensure we set the default only once
    );

    // Prefill selected camp once data arrives
    this.camps$.subscribe(list => {
      if (list?.length && !this.f['campId'].value) {
        this.f['campId'].setValue(list[0].id);
      }
    });
  }

  private pickDefaultCampId(camps: Array<{ id:string; dates:{ start:string } }>): string {
    const now = new Date();
    const byStart = [...camps].sort(
      (a,b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime()
    );
    const upcoming = byStart.find(c => new Date(c.dates.start) >= now);
    return (upcoming ?? byStart[0]).id;
  }


  get f() { return this.form.controls; }
  get p() { return (this.form.get('player') as FormGroup).controls; }
  get g() { return (this.form.get('guardian') as FormGroup).controls; }
  
  private digitsOnly(s?: string | null) { return (s ?? '').replace(/\D+/g, '') || null; }


  // Validates pattern AND real calendar date (handles leap years)
  private isoDateValidator(c: AbstractControl): ValidationErrors | null {
    const v = (c.value ?? '').toString().trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return { isoDate: 'Use YYYY-MM-DD' };

    const [y, m, d] = v.split('-').map(Number);
    if (m < 1 || m > 12) return { isoDate: 'Invalid month' };
    const daysInMonth = new Date(y, m, 0).getDate(); // 0 = last day of prev month
    if (d < 1 || d > daysInMonth) return { isoDate: 'Invalid day' };
    return null;
  }
  // --- Validators / guards ---
  private stringValidator(): ValidatorFn {
    // Unicode letters + space/.'- , min length 2
    const rx = /^[\p{L} .'-]{2,}$/u;
    return (c: AbstractControl) =>
      !c.value ? { required: true } : rx.test(String(c.value).trim()) ? null : { name: true };
  }
  private isSport(v: unknown): v is SportOption {
    return this.sportOptions.includes(v as SportOption);
  }

    // ---------- Helpers for price display / logic ----------
    isEarlyBird(camp: Camp, now = new Date()): boolean {
      return !!camp.earlyBird && new Date(camp.earlyBird.deadline) >= now;
    }  
    priceFor(camp: Camp, now = new Date()): string {
      return this.isEarlyBird(camp, now) ? (camp.earlyBird!.price) : camp.price;
    }
    computeAmountCents(camp: Camp, now = new Date()): number {
      const priceStr = this.priceFor(camp, now);
      const num = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      return Math.round(num * 100);
    }  
    selectedCamp(camps: Camp[]): Camp | undefined {
      const sel = this.form.controls['activityId'].value;
      return camps.find(c => c.id === sel);
    }  
    trackById = (_: number, c: Camp) => c.id;
    //======================================================

  async submit() {
    this.errorMsg.set(null);
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      alert('async submit() ' + this.form.invalid);

      return;
    }
    alert('async submit()');

    const v = this.form.value;

    const cleanPhonePlayer = this.digitsOnly(v.player!.phone);
    const cleanPhoneGuardian = this.digitsOnly(v.guardian!.phone);

    const payload: CampRegistrationPayload = {
      campId: v.activityId!, sport: v.sport!,
      player: {
        firstName: v.player!.firstName!, lastName: v.player!.lastName!,
        dob: v.player!.dob!, email: v.player!.email ?? null, phone: cleanPhonePlayer ?? null,
        school: v.player!.school ?? null, gradeOrForm: v.player!.gradeOrForm!,
        position: v.player!.position!, skillLevel: v.player!.skillLevel!, tshirtSize: v.player!.tshirtSize!,
      },
      guardian: {
        name: v.guardian!.name!, email: v.guardian!.email!,
        phone: cleanPhoneGuardian!, relation: v.guardian!.relation!,
      },
      notes: v.notes ?? null,
      createdAt: new Date().toISOString(),
    };

    /*
    try {
      this.submitting.set(true);
      await this.reg.createCampRegistration(payload).toPromise() as any;
      this.success.set(true);
      this.form.reset({
        sport: this.sports[0],
        player: { skillLevel: this.skills[0], tshirtSize: this.sizes[0] }
      });
    } catch (err) {
      const e = err as any;
      const errorMsg =
        typeof e === 'object' && e !== null && 'error' in e && typeof e.error?.message === 'string'
          ? e.error.message
          : 'Could not submit registration. Please try again.';
      this.errorMsg.set(errorMsg);
    } finally {
      this.submitting.set(false);
    }
      */
     
    try {
      this.submitting.set(true);
      await this.reg.createCampRegistration(payload).toPromise();
      this.success.set(true);
      this.form.reset({
        sport: this.sportOptions[0],
        player: { skillLevel: this.skillOptions[0], tshirtSize: this.sizeOptions[0] }
      });
    } catch (err: any) {
      this.errorMsg.set(err?.error?.message ?? 'Could not submit registration. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}


