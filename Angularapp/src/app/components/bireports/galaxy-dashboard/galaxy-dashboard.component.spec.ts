import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyDashboardComponent } from './galaxy-dashboard.component';

describe('GalaxyDashboardComponent', () => {
  let component: GalaxyDashboardComponent;
  let fixture: ComponentFixture<GalaxyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalaxyDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaxyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
