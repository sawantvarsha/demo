import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccuComponent } from './accu.component';

describe('AccuComponent', () => {
  let component: AccuComponent;
  let fixture: ComponentFixture<AccuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
