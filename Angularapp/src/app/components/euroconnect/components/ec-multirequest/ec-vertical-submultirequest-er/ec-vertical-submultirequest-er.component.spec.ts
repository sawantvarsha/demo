import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcVerticalSubmultirequestErComponent } from './ec-vertical-submultirequest-er.component';

describe('EcVerticalSubmultirequestErComponent', () => {
  let component: EcVerticalSubmultirequestErComponent;
  let fixture: ComponentFixture<EcVerticalSubmultirequestErComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcVerticalSubmultirequestErComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcVerticalSubmultirequestErComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
