import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcAuditTrailComponent } from './ec-audit-trail.component';

describe('EcAuditTrailComponent', () => {
  let component: EcAuditTrailComponent;
  let fixture: ComponentFixture<EcAuditTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcAuditTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
