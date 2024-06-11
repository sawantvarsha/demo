import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFQLogMonitorComponent } from './rfqlog-monitor.component';

describe('RFQLogMonitorComponent', () => {
  let component: RFQLogMonitorComponent;
  let fixture: ComponentFixture<RFQLogMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RFQLogMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RFQLogMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
