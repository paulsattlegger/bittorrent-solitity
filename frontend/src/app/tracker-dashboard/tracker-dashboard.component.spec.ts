import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrackerDashboardComponent} from './tracker-dashboard.component';

describe('TrackerOverviewComponent', () => {
  let component: TrackerDashboardComponent;
  let fixture: ComponentFixture<TrackerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackerDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrackerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
