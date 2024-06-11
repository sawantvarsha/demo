import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRMDetailsComponent } from './login-rmdetails.component';

describe('LoginRMDetailsComponent', () => {
  let component: LoginRMDetailsComponent;
  let fixture: ComponentFixture<LoginRMDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRMDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRMDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
