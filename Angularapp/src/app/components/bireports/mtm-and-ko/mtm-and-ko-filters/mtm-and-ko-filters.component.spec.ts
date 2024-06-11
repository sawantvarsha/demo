import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKoFiltersComponent } from './mtm-and-ko-filters.component';

describe('MtmAndKoFiltersComponent', () => {
  let component: MtmAndKoFiltersComponent;
  let fixture: ComponentFixture<MtmAndKoFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKoFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKoFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
