import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRequestLaunchCardComponent } from './multi-request-launch-card.component';

describe('MultiRequestLaunchCardComponent', () => {
  let component: MultiRequestLaunchCardComponent;
  let fixture: ComponentFixture<MultiRequestLaunchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiRequestLaunchCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRequestLaunchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
