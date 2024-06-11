import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiBondsComponent } from './fi-bonds.component';

describe('FiBondsComponent', () => {
  let component: FiBondsComponent;
  let fixture: ComponentFixture<FiBondsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiBondsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
