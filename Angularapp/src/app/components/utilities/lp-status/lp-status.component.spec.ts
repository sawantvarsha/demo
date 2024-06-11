import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpStatusComponent } from './lp-status.component';

describe('LpStatusComponent', () => {
  let component: LpStatusComponent;
  let fixture: ComponentFixture<LpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
