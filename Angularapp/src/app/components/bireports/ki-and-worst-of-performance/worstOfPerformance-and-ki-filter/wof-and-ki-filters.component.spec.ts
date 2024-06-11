import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WofAndKiFiltersComponent } from './wof-and-ki-filters.component';

describe('WofAndKiFiltersComponent', () => {
  let component: WofAndKiFiltersComponent;
  let fixture: ComponentFixture<WofAndKiFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WofAndKiFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WofAndKiFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
