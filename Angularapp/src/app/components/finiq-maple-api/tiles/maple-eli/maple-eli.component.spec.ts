import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleEliComponent } from './maple-eli.component';

describe('MapleEliComponent', () => {
  let component: MapleEliComponent;
  let fixture: ComponentFixture<MapleEliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleEliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleEliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
