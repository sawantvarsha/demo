import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleEQCComponent } from './maple-eqc.component';

describe('MapleEQCComponent', () => {
  let component: MapleEQCComponent;
  let fixture: ComponentFixture<MapleEQCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleEQCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleEQCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
