import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FXSpotComponent } from './fxspot.component';

describe('FXSpotComponent', () => {
  let component: FXSpotComponent;
  let fixture: ComponentFixture<FXSpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FXSpotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FXSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
