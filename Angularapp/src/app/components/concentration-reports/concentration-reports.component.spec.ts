import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcentrationReportsComponent } from './concentration-reports.component';

describe('ConcentrationReportsComponent', () => {
  let component: ConcentrationReportsComponent;
  let fixture: ComponentFixture<ConcentrationReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcentrationReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcentrationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
