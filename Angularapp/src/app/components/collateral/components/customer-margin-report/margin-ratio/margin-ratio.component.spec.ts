import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginRatioComponent } from './margin-ratio.component';

describe('MarginRatioComponent', () => {
  let component: MarginRatioComponent;
  let fixture: ComponentFixture<MarginRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
