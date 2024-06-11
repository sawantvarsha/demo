import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropdownMultiSelectComponent } from './custom-dropdown-multi-select.component';

describe('CustomDropdownMultiSelectComponent', () => {
  let component: CustomDropdownMultiSelectComponent;
  let fixture: ComponentFixture<CustomDropdownMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDropdownMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDropdownMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
