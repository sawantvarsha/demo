import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientwiseFxPositionComponent } from './clientwise-fx-position.component';

describe('ClientwiseFxPositionComponent', () => {
  let component: ClientwiseFxPositionComponent;
  let fixture: ComponentFixture<ClientwiseFxPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientwiseFxPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientwiseFxPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
