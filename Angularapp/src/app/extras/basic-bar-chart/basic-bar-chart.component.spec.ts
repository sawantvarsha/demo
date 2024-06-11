import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBarChartComponent } from './basic-bar-chart.component';

describe('BasicBarChartComponent', () => {
  let component: BasicBarChartComponent;
  let fixture: ComponentFixture<BasicBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
