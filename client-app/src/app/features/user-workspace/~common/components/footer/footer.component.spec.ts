import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkspaceFooterComponent } from './footer.component';

describe('UserWorkspaceFooterComponent', () => {
  let component: UserWorkspaceFooterComponent;
  let fixture: ComponentFixture<UserWorkspaceFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkspaceFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorkspaceFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
