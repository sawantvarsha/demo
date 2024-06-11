import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierComponent } from './barrier.component';

describe('BarrierComponent', () => {
  let component: BarrierComponent;
  let fixture: ComponentFixture<BarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
