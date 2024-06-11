import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleInsuranceComponent } from './maple-insurance.component';

describe('InsuranceComponent', () => {
  let component: MapleInsuranceComponent;
  let fixture: ComponentFixture<MapleInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
