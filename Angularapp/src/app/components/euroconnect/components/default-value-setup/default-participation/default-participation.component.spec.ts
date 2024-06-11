import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultParticipationComponent } from './default-participation.component';

describe('DefaultParticipationComponent', () => {
  let component: DefaultParticipationComponent;
  let fixture: ComponentFixture<DefaultParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
