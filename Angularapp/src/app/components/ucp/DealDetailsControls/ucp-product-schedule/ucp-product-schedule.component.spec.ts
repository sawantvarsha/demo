import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcpProductScheduleComponent } from './ucp-product-schedule.component';

describe('UcpProductScheduleComponent', () => {
  let component: UcpProductScheduleComponent;
  let fixture: ComponentFixture<UcpProductScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcpProductScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcpProductScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
