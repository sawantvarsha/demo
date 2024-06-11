import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultiCustomstrategyComponent } from './ec-multi-customstrategy.component';

describe('EcMultiCustomstrategyComponent', () => {
  let component: EcMultiCustomstrategyComponent;
  let fixture: ComponentFixture<EcMultiCustomstrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultiCustomstrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultiCustomstrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
