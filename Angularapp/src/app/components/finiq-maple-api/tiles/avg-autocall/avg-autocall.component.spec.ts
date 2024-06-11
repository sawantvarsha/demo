import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgAutocallComponent } from './avg-autocall.component';

describe('AvgAutocallComponent', () => {
  let component: AvgAutocallComponent;
  let fixture: ComponentFixture<AvgAutocallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgAutocallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgAutocallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
