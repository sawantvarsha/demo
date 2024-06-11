import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotforwardblotterComponent } from './spotforwardblotter.component';

describe('SpotforwardblotterComponent', () => {
  let component: SpotforwardblotterComponent;
  let fixture: ComponentFixture<SpotforwardblotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotforwardblotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotforwardblotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
