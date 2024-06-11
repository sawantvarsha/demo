import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelciComponent } from './relci.component';

describe('RelciComponent', () => {
  let component: RelciComponent;
  let fixture: ComponentFixture<RelciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
