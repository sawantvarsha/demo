import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultiAccuComponent } from './ec-multi-accu.component';

describe('EcMultiAccuComponent', () => {
  let component: EcMultiAccuComponent;
  let fixture: ComponentFixture<EcMultiAccuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultiAccuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultiAccuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
