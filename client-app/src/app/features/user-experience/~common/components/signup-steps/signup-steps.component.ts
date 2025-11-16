import { Component, Input, OnChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { BasePageComponent } from '../../../../../core/directives/base-page.directive';

@Component({
  selector: 'app-signup-steps',
  standalone: true,
  imports: [NgIf],
  templateUrl: './signup-steps.component.html',
  styleUrls: ['./signup-steps.component.scss']
})
export class SignupStepsComponent  extends BasePageComponent implements OnChanges {
  override pageName = 'global-page';

  /** Public URL to your registration page/route */
  @Input() registrationUrl: string = '/register';

  /** Coach/director contact email */
  @Input() directorEmail: string = 'DeaconsBC@outlook.com';

  /** Director title/name (for copy) */
  @Input() directorTitle: string = 'Director of Youth Development';
  @Input() directorName: string = 'Director of Youth Development';

  /** Optional: call-to-action text */
  @Input() ctaLabel: string = 'Join an Academy Today';

  /** Optional: practice info for step 3 (can be shown under the step) */
  @Input() practiceNote?: string;

  ngOnChanges(): void {
    // Any input processing if needed
  }
}
