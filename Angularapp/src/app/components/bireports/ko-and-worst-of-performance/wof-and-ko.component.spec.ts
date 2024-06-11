import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoAndWorstOfPerformanceComponent } from './wof-and-ko.component';

describe('KoAndWorstOfPerformanceComponent', () => {
  let component: KoAndWorstOfPerformanceComponent;
  let fixture: ComponentFixture<KoAndWorstOfPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoAndWorstOfPerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoAndWorstOfPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
