import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivityApi, Activity } from '../../apis/activity.api';

@Component({
  selector: 'app-cards-cmp',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'

})
export class CardsComponent  {
  @Input({ required: true }) interest: 'basketball' | 'soccer' | string = 'basketball';
  @Input() urlPath: string = 'en'; // supply from parent as needed
  @Input({ required: true }) cityAndCountry: string = 'Barbados';        // NEW
  @Input() activeOnly?: boolean = false;        // NEW
  @Input({ required: true }) activityType:  string = 'Basketball-academy';

  private activitySvc = inject(ActivityApi);
  activities$!: Observable<Activity[]>;

  ngOnInit(): void {
    //cityAndCountry = this.route.snapshot.queryParamMap.get('city') ?? undefined;
    this.activities$ = this.activitySvc.getActivities$(this.interest.trim().toLocaleLowerCase(), this.cityAndCountry.trim().toLocaleLowerCase(), this.activeOnly);
  }

  trackById = (_: number, c: Activity) => c.id;
  sameYear(c: Activity): boolean {
    const s = new Date(c.dates.start); 
    const e = new Date(c.dates.end);
    return s.getFullYear() === e.getFullYear();
  }
}
