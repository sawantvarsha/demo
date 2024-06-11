import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularinvestmentschemeComponent } from './regularinvestmentscheme.component';

describe('RegularinvestmentschemeComponent', () => {
  let component: RegularinvestmentschemeComponent;
  let fixture: ComponentFixture<RegularinvestmentschemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularinvestmentschemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularinvestmentschemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
