import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxvanillaMultiRequestComponent } from './fxvanilla-multi-request.component';

describe('FxvanillaMultiRequestComponent', () => {
  let component: FxvanillaMultiRequestComponent;
  let fixture: ComponentFixture<FxvanillaMultiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxvanillaMultiRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxvanillaMultiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
