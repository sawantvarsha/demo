import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFundDetailsComponent } from './new-fund-details.component';

describe('NewFundDetailsComponent', () => {
  let component: NewFundDetailsComponent;
  let fixture: ComponentFixture<NewFundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFundDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
