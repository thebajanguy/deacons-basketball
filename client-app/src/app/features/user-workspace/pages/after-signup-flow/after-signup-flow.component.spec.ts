import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSignupFlowComponent } from './after-signup-flow.component';

describe('AfterSignupFlowComponent', () => {
  let component: AfterSignupFlowComponent;
  let fixture: ComponentFixture<AfterSignupFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterSignupFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterSignupFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
