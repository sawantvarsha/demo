import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKiFiltersComponent } from './mtm-and-ki-filters.component';

describe('MtmAndKiFiltersComponent', () => {
  let component: MtmAndKiFiltersComponent;
  let fixture: ComponentFixture<MtmAndKiFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKiFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKiFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
