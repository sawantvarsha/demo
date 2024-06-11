import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageNewsComponent } from './landing-page-news.component';

describe('LandingPageNewsComponent', () => {
  let component: LandingPageNewsComponent;
  let fixture: ComponentFixture<LandingPageNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
