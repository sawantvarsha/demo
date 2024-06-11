import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekLcmTopFilterComponent } from './greek-lcm-top-filter.component';

describe('GreekLcmTopFilterComponent', () => {
  let component: GreekLcmTopFilterComponent;
  let fixture: ComponentFixture<GreekLcmTopFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekLcmTopFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreekLcmTopFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
