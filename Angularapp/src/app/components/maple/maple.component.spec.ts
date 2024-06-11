import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapleComponent } from './maple.component';

describe('MapleComponent', () => {
  let component: MapleComponent;
  let fixture: ComponentFixture<MapleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
