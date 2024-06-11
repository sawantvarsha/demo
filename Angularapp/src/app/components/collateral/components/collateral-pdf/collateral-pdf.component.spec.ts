import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralPDFComponent } from './collateral-pdf.component';

describe('CollateralPDFComponent', () => {
  let component: CollateralPDFComponent;
  let fixture: ComponentFixture<CollateralPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
