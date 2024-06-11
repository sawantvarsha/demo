import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FCNComponent } from './fcn.component';

describe('FCNComponent', () => {
  let component: FCNComponent;
  let fixture: ComponentFixture<FCNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FCNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FCNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
