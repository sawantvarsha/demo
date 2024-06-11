import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcSubmultirequestYeComponent } from './ec-submultirequest-ye.component';

describe('EcSubmultirequestYeComponent', () => {
  let component: EcSubmultirequestYeComponent;
  let fixture: ComponentFixture<EcSubmultirequestYeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcSubmultirequestYeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcSubmultirequestYeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
