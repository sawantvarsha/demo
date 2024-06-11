import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDecumComponent } from './default-decum.component';

describe('DefaultDecumComponent', () => {
  let component: DefaultDecumComponent;
  let fixture: ComponentFixture<DefaultDecumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultDecumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDecumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
