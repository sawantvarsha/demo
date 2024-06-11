import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetExposureDateSliderComponent } from './asset-exposure-date-slider.component';

describe('AssetExposureDateSliderComponent', () => {
  let component: AssetExposureDateSliderComponent;
  let fixture: ComponentFixture<AssetExposureDateSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetExposureDateSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetExposureDateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
