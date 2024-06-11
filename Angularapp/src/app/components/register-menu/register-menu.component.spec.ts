import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMenuComponent } from './register-menu.component';

describe('RegisterMenuComponent', () => {
  let component: RegisterMenuComponent;
  let fixture: ComponentFixture<RegisterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
