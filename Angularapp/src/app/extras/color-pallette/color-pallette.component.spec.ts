import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPalletteComponent } from './color-pallette.component';

describe('ColorPalletteComponent', () => {
  let component: ColorPalletteComponent;
  let fixture: ComponentFixture<ColorPalletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPalletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPalletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
