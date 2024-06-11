import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcSelectAllOptionComponent } from './ec-select-all-option.component';

describe('EcSelectAllOptionComponent', () => {
  let component: EcSelectAllOptionComponent;
  let fixture: ComponentFixture<EcSelectAllOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcSelectAllOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcSelectAllOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
