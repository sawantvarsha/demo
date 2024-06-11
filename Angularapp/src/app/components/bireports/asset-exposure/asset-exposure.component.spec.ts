import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetExposureComponent } from './asset-exposure.component';

describe('AssetExposureComponent', () => {
  let component: AssetExposureComponent;
  let fixture: ComponentFixture<AssetExposureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetExposureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
