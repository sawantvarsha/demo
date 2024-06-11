import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitabilityComponent } from './suitability.component';

describe('SuitabilityComponent', () => {
  let component: SuitabilityComponent;
  let fixture: ComponentFixture<SuitabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
