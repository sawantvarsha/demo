import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullpageDashboardComponent } from './fullpage-dashboard.component';

describe('FullpageDashboardComponent', () => {
  let component: FullpageDashboardComponent;
  let fixture: ComponentFixture<FullpageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullpageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullpageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
