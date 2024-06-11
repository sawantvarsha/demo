import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmCustomerMapperComponent } from './rm-customer-mapper.component';

describe('RmCustomerMapperComponent', () => {
  let component: RmCustomerMapperComponent;
  let fixture: ComponentFixture<RmCustomerMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmCustomerMapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmCustomerMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
