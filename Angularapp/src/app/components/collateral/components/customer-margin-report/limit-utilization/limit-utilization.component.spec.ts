import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitUtilizationComponent } from './limit-utilization.component';

describe('LimitUtilizationComponent', () => {
  let component: LimitUtilizationComponent;
  let fixture: ComponentFixture<LimitUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
