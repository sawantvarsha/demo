import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiAndWorstOfPerformanceTopFiltersComponent } from './ki-and-worst-of-performance-top-filters.component';

describe('KiAndWorstOfPerformanceTopFiltersComponent', () => {
  let component: KiAndWorstOfPerformanceTopFiltersComponent;
  let fixture: ComponentFixture<KiAndWorstOfPerformanceTopFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiAndWorstOfPerformanceTopFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiAndWorstOfPerformanceTopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
