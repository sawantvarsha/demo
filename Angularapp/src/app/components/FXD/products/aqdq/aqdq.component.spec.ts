import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqdqComponent } from './aqdq.component';

describe('AqdqComponent', () => {
  let component: AqdqComponent;
  let fixture: ComponentFixture<AqdqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AqdqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AqdqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
