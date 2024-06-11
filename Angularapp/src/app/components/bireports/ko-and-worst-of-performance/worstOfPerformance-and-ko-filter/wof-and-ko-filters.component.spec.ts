import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WofAndKoFiltersComponent } from './wof-and-ko-filters.component';

describe('WofAndKoFiltersComponent', () => {
  let component: WofAndKoFiltersComponent;
  let fixture: ComponentFixture<WofAndKoFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WofAndKoFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WofAndKoFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
