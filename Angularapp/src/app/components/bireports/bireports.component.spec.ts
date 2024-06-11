import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BIReportsComponent } from './bireports.component';

describe('BIReportsComponent', () => {
  let component: BIReportsComponent;
  let fixture: ComponentFixture<BIReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BIReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BIReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
