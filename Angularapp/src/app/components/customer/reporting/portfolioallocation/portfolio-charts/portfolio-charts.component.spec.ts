import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioChartsComponent } from './portfolio-charts.component';

describe('PortfolioChartsComponent', () => {
  let component: PortfolioChartsComponent;
  let fixture: ComponentFixture<PortfolioChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
