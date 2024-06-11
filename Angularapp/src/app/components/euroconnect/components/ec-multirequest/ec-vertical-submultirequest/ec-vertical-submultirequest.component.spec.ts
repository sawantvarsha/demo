import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcVerticalSubmultirequestComponent } from './ec-vertical-submultirequest.component';

describe('EcVerticalSubmultirequestComponent', () => {
  let component: EcVerticalSubmultirequestComponent;
  let fixture: ComponentFixture<EcVerticalSubmultirequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcVerticalSubmultirequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcVerticalSubmultirequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
