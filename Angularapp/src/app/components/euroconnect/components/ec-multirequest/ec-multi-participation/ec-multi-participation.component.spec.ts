import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMultiParticipationComponent } from './ec-multi-participation.component';

describe('EcMultiParticipationComponent', () => {
  let component: EcMultiParticipationComponent;
  let fixture: ComponentFixture<EcMultiParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcMultiParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMultiParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
