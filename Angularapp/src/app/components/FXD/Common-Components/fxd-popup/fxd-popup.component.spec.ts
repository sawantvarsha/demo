import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxdPopupComponent } from './fxd-popup.component';

describe('FxdPopupComponent', () => {
  let component: FxdPopupComponent;
  let fixture: ComponentFixture<FxdPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxdPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxdPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
