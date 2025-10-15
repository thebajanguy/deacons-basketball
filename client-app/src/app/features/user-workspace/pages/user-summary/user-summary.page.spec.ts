import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryComponent } from './user-summary.page';

describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<UserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
