import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxTrfComponent } from './fx-trf.component';

describe('FxTrfComponent', () => {
  let component: FxTrfComponent;
  let fixture: ComponentFixture<FxTrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxTrfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxTrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
