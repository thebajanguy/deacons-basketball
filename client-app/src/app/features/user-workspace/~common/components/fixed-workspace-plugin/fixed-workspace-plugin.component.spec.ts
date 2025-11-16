import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedJoinNowPluginComponent } from './fixed-workspace-plugin.component';

describe('FixedJoinNowPluginComponent', () => {
  let component: FixedJoinNowPluginComponent;
  let fixture: ComponentFixture<FixedJoinNowPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedJoinNowPluginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedJoinNowPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
