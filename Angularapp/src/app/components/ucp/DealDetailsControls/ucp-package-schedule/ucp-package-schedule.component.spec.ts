import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcpPackageScheduleComponent } from './ucp-package-schedule.component';

describe('UcpPackageScheduleComponent', () => {
  let component: UcpPackageScheduleComponent;
  let fixture: ComponentFixture<UcpPackageScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcpPackageScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcpPackageScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
