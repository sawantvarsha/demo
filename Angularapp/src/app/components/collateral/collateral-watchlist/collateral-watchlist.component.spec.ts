import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralWatchlistComponent } from './collateral-watchlist.component';

describe('CollateralWatchlistComponent', () => {
  let component: CollateralWatchlistComponent;
  let fixture: ComponentFixture<CollateralWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollateralWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
