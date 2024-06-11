import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcVerticalSubmultirequestCsComponent } from './ec-vertical-submultirequest-cs.component';

describe('EcVerticalSubmultirequestCsComponent', () => {
  let component: EcVerticalSubmultirequestCsComponent;
  let fixture: ComponentFixture<EcVerticalSubmultirequestCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcVerticalSubmultirequestCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcVerticalSubmultirequestCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
