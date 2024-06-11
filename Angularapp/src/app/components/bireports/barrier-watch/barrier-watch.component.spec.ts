import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierWatchComponent } from './barrier-watch.component';

describe('BarrierWatchComponent', () => {
  let component: BarrierWatchComponent;
  let fixture: ComponentFixture<BarrierWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierWatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrierWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
