import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WFBlotterComponent } from './wfblotter.component';

describe('WFBlotterComponent', () => {
  let component: WFBlotterComponent;
  let fixture: ComponentFixture<WFBlotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WFBlotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WFBlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
