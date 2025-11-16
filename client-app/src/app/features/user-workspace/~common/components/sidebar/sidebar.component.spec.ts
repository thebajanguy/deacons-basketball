import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkspaceSidebarComponent } from './sidebar.component';

describe('UserWorkspaceSidebarComponent', () => {
  let component: UserWorkspaceSidebarComponent;
  let fixture: ComponentFixture<UserWorkspaceSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkspaceSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWorkspaceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
