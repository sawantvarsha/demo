import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcpProductScheduleMutationComponent } from './ucp-product-schedule-mutation.component';

describe('UcpProductScheduleMutationComponent', () => {
  let component: UcpProductScheduleMutationComponent;
  let fixture: ComponentFixture<UcpProductScheduleMutationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UcpProductScheduleMutationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UcpProductScheduleMutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
