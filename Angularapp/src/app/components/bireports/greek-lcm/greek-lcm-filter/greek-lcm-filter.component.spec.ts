import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekLcmFilterComponent } from './greek-lcm-filter.component';

describe('GreekLcmFilterComponent', () => {
  let component: GreekLcmFilterComponent;
  let fixture: ComponentFixture<GreekLcmFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekLcmFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreekLcmFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
