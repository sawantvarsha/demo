import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordOverrideComponent } from './password-override.component';

describe('PasswordOverrideComponent', () => {
  let component: PasswordOverrideComponent;
  let fixture: ComponentFixture<PasswordOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordOverrideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
