import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleStrategyComponent } from './maple-strategy.component';

describe('MapleStrategyComponent', () => {
  let component: MapleStrategyComponent;
  let fixture: ComponentFixture<MapleStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
