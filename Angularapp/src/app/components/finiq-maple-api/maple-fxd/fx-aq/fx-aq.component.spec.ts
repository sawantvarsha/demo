import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxAqComponent } from './fx-aq.component';

describe('FxAqComponent', () => {
  let component: FxAqComponent;
  let fixture: ComponentFixture<FxAqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxAqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxAqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
