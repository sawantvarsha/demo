import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchfundComponent } from './switchfund.component';

describe('SwitchfundComponent', () => {
  let component: SwitchfundComponent;
  let fixture: ComponentFixture<SwitchfundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchfundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
