import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGridFieldTemplatesComponent } from './customer-grid-field-templates.component';

describe('CustomerGridFieldTemplatesComponent', () => {
  let component: CustomerGridFieldTemplatesComponent;
  let fixture: ComponentFixture<CustomerGridFieldTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGridFieldTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGridFieldTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
