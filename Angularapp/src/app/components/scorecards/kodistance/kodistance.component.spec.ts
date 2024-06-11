import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KODistanceComponent } from './kodistance.component';

describe('KODistanceComponent', () => {
  let component: KODistanceComponent;
  let fixture: ComponentFixture<KODistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KODistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KODistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
