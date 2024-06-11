import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGenericResponseComponent } from './api-generic-response.component';

describe('ApiGenericResponseComponent', () => {
  let component: ApiGenericResponseComponent;
  let fixture: ComponentFixture<ApiGenericResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiGenericResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGenericResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
