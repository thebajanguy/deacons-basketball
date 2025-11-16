import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedSettingsPluginComponent } from './fixed-settings-plugin.component';

describe('FixedSettingsPluginComponent', () => {
  let component: FixedSettingsPluginComponent;
  let fixture: ComponentFixture<FixedSettingsPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedSettingsPluginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedSettingsPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
