import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcSubmultirequestErComponent } from './ec-submultirequest-er.component';

describe('EcSubmultirequestErComponent', () => {
  let component: EcSubmultirequestErComponent;
  let fixture: ComponentFixture<EcSubmultirequestErComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcSubmultirequestErComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcSubmultirequestErComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
