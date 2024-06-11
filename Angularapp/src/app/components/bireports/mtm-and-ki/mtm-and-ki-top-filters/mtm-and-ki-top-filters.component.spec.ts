import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKiTopFiltersComponent } from './mtm-and-ki-top-filters.component';

describe('MtmAndKiTopFiltersComponent', () => {
  let component: MtmAndKiTopFiltersComponent;
  let fixture: ComponentFixture<MtmAndKiTopFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKiTopFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmAndKiTopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
