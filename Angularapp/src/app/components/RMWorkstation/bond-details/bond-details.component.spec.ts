import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondDetailsComponent } from './bond-details.component';

describe('BondDetailsComponent', () => {
  let component: BondDetailsComponent;
  let fixture: ComponentFixture<BondDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BondDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BondDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
