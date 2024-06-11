import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartBasicComponent } from './line-chart-basic.component';

describe('LineChartBasicComponent', () => {
  let component: LineChartBasicComponent;
  let fixture: ComponentFixture<LineChartBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChartBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
