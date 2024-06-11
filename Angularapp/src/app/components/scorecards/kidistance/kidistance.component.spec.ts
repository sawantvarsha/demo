import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KIDistanceComponent } from './kidistance.component';

describe('KIDistanceComponent', () => {
  let component: KIDistanceComponent;
  let fixture: ComponentFixture<KIDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KIDistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KIDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
