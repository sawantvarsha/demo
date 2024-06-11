import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELNComponent } from './eln.component';

describe('ELNComponent', () => {
  let component: ELNComponent;
  let fixture: ComponentFixture<ELNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ELNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ELNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
