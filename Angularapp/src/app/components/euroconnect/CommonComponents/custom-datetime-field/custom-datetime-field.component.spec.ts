import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatetimeFieldComponent } from './custom-datetime-field.component';

describe('CustomDatetimeFieldComponent', () => {
  let component: CustomDatetimeFieldComponent;
  let fixture: ComponentFixture<CustomDatetimeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDatetimeFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatetimeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
