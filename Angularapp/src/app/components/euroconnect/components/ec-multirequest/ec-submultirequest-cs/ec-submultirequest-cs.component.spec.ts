import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcSubmultirequestCsComponent } from './ec-submultirequest-cs.component';

describe('EceSubmultirequestCsComponent', () => {
  let component: EcSubmultirequestCsComponent;
  let fixture: ComponentFixture<EcSubmultirequestCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcSubmultirequestCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcSubmultirequestCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
