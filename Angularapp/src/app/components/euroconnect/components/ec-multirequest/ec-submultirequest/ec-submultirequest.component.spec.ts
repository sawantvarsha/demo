import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcSubmultirequestComponent } from './ec-submultirequest.component';

describe('EcSubmultirequestComponent', () => {
  let component: EcSubmultirequestComponent;
  let fixture: ComponentFixture<EcSubmultirequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcSubmultirequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcSubmultirequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
