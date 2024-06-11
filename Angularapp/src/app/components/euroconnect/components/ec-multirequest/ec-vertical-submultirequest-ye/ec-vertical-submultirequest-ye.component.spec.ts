import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcVerticalSubmultirequestYeComponent } from './ec-vertical-submultirequest-ye.component';

describe('EcVerticalSubmultirequestYeComponent', () => {
  let component: EcVerticalSubmultirequestYeComponent;
  let fixture: ComponentFixture<EcVerticalSubmultirequestYeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcVerticalSubmultirequestYeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcVerticalSubmultirequestYeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
