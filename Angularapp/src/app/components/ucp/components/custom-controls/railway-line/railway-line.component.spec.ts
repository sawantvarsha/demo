import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RailwayLineComponent } from './railway-line.component';

describe('RailwayLineComponent', () => {
  let component: RailwayLineComponent;
  let fixture: ComponentFixture<RailwayLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailwayLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailwayLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
