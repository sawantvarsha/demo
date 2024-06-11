import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcPricersComponent } from './ec-pricers.component';

describe('EcPricersComponent', () => {
  let component: EcPricersComponent;
  let fixture: ComponentFixture<EcPricersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcPricersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcPricersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
