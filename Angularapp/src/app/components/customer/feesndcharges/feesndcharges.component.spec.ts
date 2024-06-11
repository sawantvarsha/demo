import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesndchargesComponent } from './feesndcharges.component';

describe('FeesndchargesComponent', () => {
  let component: FeesndchargesComponent;
  let fixture: ComponentFixture<FeesndchargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesndchargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesndchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
