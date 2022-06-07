import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerSettingsComponent } from './tracker-settings.component';

describe('TrackerSettingsComponent', () => {
  let component: TrackerSettingsComponent;
  let fixture: ComponentFixture<TrackerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackerSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
