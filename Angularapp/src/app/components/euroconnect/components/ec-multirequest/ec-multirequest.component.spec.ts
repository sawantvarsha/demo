import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultirequestComponent } from './ec-multirequest.component';

describe('EcMultirequestComponent', () => {
  let component: EcMultirequestComponent;
  let fixture: ComponentFixture<EcMultirequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultirequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultirequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
