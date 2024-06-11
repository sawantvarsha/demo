import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcCapsFloorsComponent } from './ec-caps-floors.component';

describe('EcCapsFloorsComponent', () => {
  let component: EcCapsFloorsComponent;
  let fixture: ComponentFixture<EcCapsFloorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcCapsFloorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcCapsFloorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
