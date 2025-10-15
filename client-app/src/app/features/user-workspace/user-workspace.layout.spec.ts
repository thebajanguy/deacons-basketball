import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkspaceComponent } from './user-workspace.component';

describe('UserWorkspaceComponent', () => {
  let component: UserWorkspaceComponent;
  let fixture: ComponentFixture<UserWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
