import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeSliderHorizontalComponent } from './range-slider-horizontal.component';

describe('RangeSliderHorizontalComponent', () => {
  let component: RangeSliderHorizontalComponent;
  let fixture: ComponentFixture<RangeSliderHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeSliderHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSliderHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
