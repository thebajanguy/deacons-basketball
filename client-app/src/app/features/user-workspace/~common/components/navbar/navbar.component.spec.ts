import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkspaceNavbarComponent } from './navbar.component';

describe('UserWorkspaceNavbarComponent', () => {
  let component: UserWorkspaceNavbarComponent;
  let fixture: ComponentFixture<UserWorkspaceNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkspaceNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorkspaceNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
