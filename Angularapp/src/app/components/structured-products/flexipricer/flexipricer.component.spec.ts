import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexipricerComponent } from './flexipricer.component';

describe('FlexipricerComponent', () => {
  let component: FlexipricerComponent;
  let fixture: ComponentFixture<FlexipricerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexipricerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexipricerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
