import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcParticipationComponent } from './ec-participation.component';

describe('EcParticipationComponent', () => {
  let component: EcParticipationComponent;
  let fixture: ComponentFixture<EcParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
