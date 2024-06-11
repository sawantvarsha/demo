import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpgReportComponent } from './mpg-report.component';

describe('MpgReportComponent', () => {
  let component: MpgReportComponent;
  let fixture: ComponentFixture<MpgReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpgReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpgReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
