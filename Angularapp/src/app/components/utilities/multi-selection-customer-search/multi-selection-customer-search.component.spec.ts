import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectionCustomerSearchComponent } from './multi-selection-customer-search.component';

describe('MultiSelectionCustomerSearchComponent', () => {
  let component: MultiSelectionCustomerSearchComponent;
  let fixture: ComponentFixture<MultiSelectionCustomerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectionCustomerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectionCustomerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
