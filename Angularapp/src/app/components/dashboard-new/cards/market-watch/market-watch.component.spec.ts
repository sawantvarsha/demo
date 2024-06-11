import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketWatchComponent } from './market-watch.component';

describe('MarketWatchComponent', () => {
  let component: MarketWatchComponent;
  let fixture: ComponentFixture<MarketWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
