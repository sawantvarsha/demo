import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceRiderComponent } from './insurance-rider.component';

describe('InsuranceRiderComponent', () => {
  let component: InsuranceRiderComponent;
  let fixture: ComponentFixture<InsuranceRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceRiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
