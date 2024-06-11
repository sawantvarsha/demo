import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteHistoryComponent } from './route-history.component';

describe('RouteHistoryComponent', () => {
  let component: RouteHistoryComponent;
  let fixture: ComponentFixture<RouteHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
