import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AQDQMapleComponent } from './aqdqmaple.component';

describe('AQDQMapleComponent', () => {
  let component: AQDQMapleComponent;
  let fixture: ComponentFixture<AQDQMapleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AQDQMapleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AQDQMapleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
