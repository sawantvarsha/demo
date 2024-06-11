import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultiEarlyredemptionComponent } from './ec-multi-earlyredemption.component';

describe('EcMultiEarlyredemptionComponent', () => {
  let component: EcMultiEarlyredemptionComponent;
  let fixture: ComponentFixture<EcMultiEarlyredemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultiEarlyredemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultiEarlyredemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
