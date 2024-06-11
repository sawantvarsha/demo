import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SIVChartsComponent } from './siv-charts.component';

describe('SIVChartsComponent', () => {
  let component: SIVChartsComponent;
  let fixture: ComponentFixture<SIVChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SIVChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SIVChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
