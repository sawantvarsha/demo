import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiAndWorstOfPerformanceComponent } from './wof-and-ki.component';

describe('KiAndWorstOfPerformanceComponent', () => {
  let component: KiAndWorstOfPerformanceComponent;
  let fixture: ComponentFixture<KiAndWorstOfPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiAndWorstOfPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KiAndWorstOfPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
