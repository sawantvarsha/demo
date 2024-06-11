import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteepenerComponent } from './steepener.component';

describe('SteepenerComponent', () => {
  let component: SteepenerComponent;
  let fixture: ComponentFixture<SteepenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteepenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteepenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
