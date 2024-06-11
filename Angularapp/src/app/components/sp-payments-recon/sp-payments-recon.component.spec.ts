import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPaymentsReconComponent } from './sp-payments-recon.component';

describe('SpPaymentsReconComponent', () => {
  let component: SpPaymentsReconComponent;
  let fixture: ComponentFixture<SpPaymentsReconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpPaymentsReconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpPaymentsReconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
